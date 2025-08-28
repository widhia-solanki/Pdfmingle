# backend/app.py

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
from pdf2image import convert_from_path
import docx
import fitz  # PyMuPDF
import io
import os
import uuid
import traceback
import subprocess
import zipfile
import shutil
import webcolors

app = Flask(__name__)

# Allow all origins for Vercel preview deployments and local development
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/ping', methods=['GET'])
def ping():
    return jsonify({"message": "pong"}), 200

@app.route('/api/pdf-to-word', methods=['POST'])
def handle_pdf_to_word():
    if 'files' not in request.files: return jsonify({"error": "No file part"}), 400
    file = request.files.get('files')
    if not file or not file.filename: return jsonify({"error": "No selected file"}), 400
    if not file.filename.lower().endswith('.pdf'): return jsonify({"error": "Invalid file type"}), 400
    temp_dir = '/tmp'
    temp_pdf_path = os.path.join(temp_dir, str(uuid.uuid4()) + '.pdf')
    try:
        file.save(temp_pdf_path)
        docx_io = io.BytesIO()
        cv = Converter(temp_pdf_path)
        cv.convert(docx_io)
        cv.close()
        docx_io.seek(0)
        return send_file(
            docx_io, as_attachment=True,
            download_name=f"{file.filename.rsplit('.', 1)[0]}.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to convert file."}), 500
    finally:
        if os.path.exists(temp_pdf_path): os.remove(temp_pdf_path)

@app.route('/api/compress-pdf', methods=['POST'])
def handle_compress_pdf():
    if 'file' not in request.files: return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    level = request.form.get('level', 'medium')
    if not file or not file.filename: return jsonify({"error": "No selected file"}), 400
    if not file.filename.lower().endswith('.pdf'): return jsonify({"error": "Invalid file type"}), 400
    gs_settings = {'low': '/ebook', 'medium': '/default', 'high': '/printer'}
    quality = gs_settings.get(level, '/default')
    temp_dir = '/tmp'
    input_path = os.path.join(temp_dir, str(uuid.uuid4()) + '_input.pdf')
    output_path = os.path.join(temp_dir, str(uuid.uuid4()) + '_output.pdf')
    try:
        file.save(input_path)
        command = [
            'gs', '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
            f'-dPDFSETTINGS={quality}', '-dNOPAUSE', '-dQUIET', '-dBATCH',
            f'-sOutputFile={output_path}', input_path
        ]
        subprocess.run(command, check=True)
        return send_file(
            output_path, as_attachment=True,
            download_name=f"compressed_{file.filename}", mimetype='application/pdf'
        )
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to process PDF."}), 500
    finally:
        if os.path.exists(input_path): os.remove(input_path)
        if os.path.exists(output_path): os.remove(output_path)

@app.route('/api/protect-pdf', methods=['POST'])
def handle_protect_pdf():
    if 'file' not in request.files: return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    password = request.form.get('password')
    if not file or not file.filename: return jsonify({"error": "No selected file"}), 400
    if not password: return jsonify({"error": "Password is required"}), 400
    try:
        pdf_stream = io.BytesIO(file.read())
        reader = PdfReader(pdf_stream)
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        writer.encrypt(password)
        encrypted_stream = io.BytesIO()
        writer.write(encrypted_stream)
        encrypted_stream.seek(0)
        return send_file(
            encrypted_stream, as_attachment=True,
            download_name=f"protected_{file.filename}", mimetype='application/pdf'
        )
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to protect the PDF."}), 500

@app.route('/api/unlock-pdf', methods=['POST'])
def handle_unlock_pdf():
    if 'file' not in request.files: return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    password = request.form.get('password')
    if not file or not file.filename: return jsonify({"error": "No selected file"}), 400
    if not password: return jsonify({"error": "Password is required"}), 400
    try:
        pdf_stream = io.BytesIO(file.read())
        reader = PdfReader(pdf_stream)
        if reader.is_encrypted:
            if not reader.decrypt(password):
                return jsonify({"error": "Incorrect password."}), 403
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        unlocked_stream = io.BytesIO()
        writer.write(unlocked_stream)
        unlocked_stream.seek(0)
        return send_file(
            unlocked_stream, as_attachment=True,
            download_name=f"unlocked_{file.filename}", mimetype='application/pdf'
        )
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to unlock the PDF."}), 500

@app.route('/api/image-to-pdf', methods=['POST'])
def handle_images_to_pdf():
    if 'files' not in request.files: return jsonify({"error": "No file part"}), 400
    files = request.files.getlist('files')
    if not files: return jsonify({"error": "No files selected"}), 400
    try:
        image_list = []
        for file in files:
            if file.mimetype not in ['image/jpeg', 'image/png']: continue
            img = Image.open(file.stream).convert("RGB")
            image_list.append(img)
        if not image_list: return jsonify({"error": "No valid JPG or PNG images found."}), 400
        pdf_stream = io.BytesIO()
        image_list[0].save(
            pdf_stream, "PDF", resolution=100.0, save_all=True, append_images=image_list[1:]
        )
        pdf_stream.seek(0)
        return send_file(
            pdf_stream, as_attachment=True,
            download_name="converted.pdf", mimetype='application/pdf'
        )
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to convert images."}), 500

@app.route('/api/pdf-to-image', methods=['POST'])
def handle_pdf_to_image():
    if 'file' not in request.files: return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if not file or not file.filename: return jsonify({"error": "No file selected"}), 400
    temp_dir = '/tmp'
    unique_id = str(uuid.uuid4())
    input_path = os.path.join(temp_dir, f"{unique_id}_input.pdf")
    output_dir = os.path.join(temp_dir, f"{unique_id}_output")
    os.makedirs(output_dir, exist_ok=True)
    try:
        file.save(input_path)
        images = convert_from_path(input_path)
        for i, image in enumerate(images):
            image_path = os.path.join(output_dir, f'page_{i+1}.jpg')
            image.save(image_path, 'JPEG')
        zip_stream = io.BytesIO()
        with zipfile.ZipFile(zip_stream, 'w', zipfile.ZIP_DEFLATED) as zf:
            for root, _, filenames in os.walk(output_dir):
                for filename in filenames:
                    zf.write(os.path.join(root, filename), filename)
        zip_stream.seek(0)
        return send_file(
            zip_stream, as_attachment=True,
            download_name=f"{file.filename.rsplit('.', 1)[0]}_images.zip", mimetype='application/zip'
        )
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to convert PDF to images."}), 500
    finally:
        if os.path.exists(input_path): os.remove(input_path)
        if os.path.exists(output_dir): shutil.rmtree(output_dir)

@app.route('/api/word-to-pdf', methods=['POST'])
def handle_word_to_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if not file or not file.filename:
        return jsonify({"error": "No file selected"}), 400
    if not file.filename.lower().endswith(('.doc', '.docx')):
        return jsonify({"error": "Invalid file type. Please upload a Word document."}), 400

    try:
        doc = docx.Document(io.BytesIO(file.read()))
        pdf_doc = fitz.open() 
        for para in doc.paragraphs:
            page = pdf_doc.new_page()
            page.insert_text((72, 72), para.text)
        pdf_bytes = pdf_doc.write()
        pdf_stream = io.BytesIO(pdf_bytes)
        pdf_stream.seek(0)
        
        return send_file(
            pdf_stream, as_attachment=True,
            download_name=f"{os.path.splitext(file.filename)[0]}.pdf",
            mimetype='application/pdf'
        )
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to convert the document."}), 500

@app.route('/api/crop-pdf', methods=['POST'])
def handle_crop_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part provided."}), 400
    
    file = request.files['file']
    try:
        x = float(request.form['x'])
        y = float(request.form['y'])
        width = float(request.form['width'])
        height = float(request.form['height'])
        scale = float(request.form['scale'])
        mode = request.form['mode']
        page_index = int(request.form.get('pageIndex', 0))

        pdf_bytes = file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        def get_pdf_rect(page, fe_x, fe_y, fe_width, fe_height, fe_scale):
            pdf_x0 = fe_x / fe_scale
            pdf_y0 = fe_y / fe_scale
            pdf_x1 = (fe_x + fe_width) / fe_scale
            pdf_y1 = (fe_y + fe_height) / fe_scale
            return fitz.Rect(pdf_x0, pdf_y0, pdf_x1, pdf_y1)

        if mode == 'all':
            first_page = doc[0]
            crop_rect = get_pdf_rect(first_page, x, y, width, height, scale)
            for page in doc:
                page.set_cropbox(crop_rect)
        elif mode == 'current':
            if 0 <= page_index < len(doc):
                page = doc[page_index]
                crop_rect = get_pdf_rect(page, x, y, width, height, scale)
                page.set_cropbox(crop_rect)
            else:
                return jsonify({"error": "Invalid page index provided."}), 400
        else:
            return jsonify({"error": "Invalid crop mode specified."}), 400

        output_stream = io.BytesIO()
        doc.save(output_stream, garbage=4, deflate=True, clean=True)
        doc.close()
        output_stream.seek(0)

        return send_file(
            output_stream, as_attachment=True,
            download_name=f"cropped_{file.filename}",
            mimetype='application/pdf'
        )
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An error occurred during cropping.", "details": str(e)}), 500

@app.route('/api/add-watermark', methods=['POST'])
def handle_add_watermark():
    if 'file' not in request.files:
        return jsonify({"error": "No PDF file part."}), 400
    
    pdf_file = request.files['file']
    watermark_type = request.form.get('type')
    
    try:
        pdf_bytes = pdf_file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")

        opacity = float(request.form.get('opacity', 0.5))
        rotation = int(request.form.get('rotation', 0))
        is_tiled = request.form.get('isTiled') == 'true'

        if watermark_type == 'text':
            text = request.form.get('text', 'WATERMARK')
            color_hex = request.form.get('color', '#000000')
            rgb_color = webcolors.hex_to_rgb(color_hex)
            color_tuple = tuple(c / 255.0 for c in rgb_color)
            font_size = int(request.form.get('fontSize', 48))
            
            for page in doc:
                rect = page.rect
                if is_tiled:
                    step_x = font_size * len(text) * 0.4
                    step_y = font_size * 2
                    for y in range(int(rect.y0), int(rect.y1), int(step_y)):
                        for x in range(int(rect.x0), int(rect.x1), int(step_x)):
                            page.insert_textbox(fitz.Rect(x, y, x + step_x, y + step_y), text, 
                                                fontsize=font_size, color=color_tuple, 
                                                rotate=rotation, opacity=opacity, align=fitz.TEXT_ALIGN_CENTER)
                else:
                    page.insert_textbox(rect, text, fontsize=font_size, color=color_tuple, 
                                        rotate=rotation, opacity=opacity, align=fitz.TEXT_ALIGN_CENTER)
        
        elif watermark_type == 'image':
            if 'watermarkImage' not in request.files:
                return jsonify({"error": "No watermark image provided."}), 400
            
            image_file = request.files['watermarkImage']
            img_bytes = image_file.read()

            for page in doc:
                rect = page.rect
                img_rect = fitz.Rect(0, 0, 150, 150)
                img_rect.center = rect.center
                
                if is_tiled:
                    step_x = 200
                    step_y = 200
                    for y in range(int(rect.y0), int(rect.y1), step_y):
                        for x in range(int(rect.x0), int(rect.x1), step_x):
                           page.insert_image(fitz.Rect(x, y, x + 150, y + 150), stream=img_bytes, 
                                             rotate=rotation, opacity=opacity, keep_proportion=True)
                else:
                    page.insert_image(img_rect, stream=img_bytes, rotate=rotation, 
                                      opacity=opacity, keep_proportion=True)
        else:
            return jsonify({"error": "Invalid watermark type specified."}), 400
            
        output_stream = io.BytesIO()
        doc.save(output_stream, garbage=4, deflate=True, clean=True)
        doc.close()
        output_stream.seek(0)
        
        return send_file(
            output_stream, as_attachment=True,
            download_name=f"watermarked_{pdf_file.filename}", mimetype='application/pdf'
        )

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An error occurred while adding the watermark.", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)
