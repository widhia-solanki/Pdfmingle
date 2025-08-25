from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
import io
import os
import uuid
import traceback
import subprocess

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://pdfmingle.net", "https://www.pdfmingle.net"]}})

@app.route('/')
def index():
    return jsonify({"message": "PDFMingle Backend is running!"})

# --- EXISTING PDF-TO-WORD ENDPOINT ---
@app.route('/pdf-to-word', methods=['POST'])
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

# --- EXISTING COMPRESS-PDF ENDPOINT ---
@app.route('/compress-pdf', methods=['POST'])
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

# --- EXISTING PROTECT-PDF ENDPOINT ---
@app.route('/protect-pdf', methods=['POST'])
def handle_protect_pdf():
    if 'file' not in request.files: return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    password = request.form.get('password')
    if not file or not file.filename: return jsonify({"error": "No selected file"}), 400
    if not file.filename.lower().endswith('.pdf'): return jsonify({"error": "Invalid file type"}), 400
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

# --- EXISTING UNLOCK-PDF ENDPOINT ---
@app.route('/unlock-pdf', methods=['POST'])
def handle_unlock_pdf():
    if 'file' not in request.files: return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    password = request.form.get('password')
    if not file or not file.filename: return jsonify({"error": "No selected file"}), 400
    if not file.filename.lower().endswith('.pdf'): return jsonify({"error": "Invalid file type"}), 400
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

# --- RENAMED IMAGES TO PDF ENDPOINT ---
@app.route('/image-to-pdf', methods=['POST'])
def handle_images_to_pdf():
    if 'files' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    files = request.files.getlist('files')
    
    if not files:
        return jsonify({"error": "No files selected"}), 400

    try:
        image_list = []
        for file in files:
            if file.mimetype not in ['image/jpeg', 'image/png']:
                continue
            
            img = Image.open(file.stream).convert("RGB")
            image_list.append(img)
        
        if not image_list:
            return jsonify({"error": "No valid JPG or PNG images found."}), 400

        pdf_stream = io.BytesIO()
        
        image_list[0].save(
            pdf_stream, 
            "PDF" ,
            resolution=100.0, 
            save_all=True, 
            append_images=image_list[1:]
        )
        pdf_stream.seek(0)

        return send_file(
            pdf_stream,
            as_attachment=True,
            download_name="converted.pdf",
            mimetype='application/pdf'
        )
    except Exception as e:
        print(f"Error converting images to PDF: {e}")
        traceback.print_exc()
        return jsonify({"error": "Failed to convert images."}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=False)```

---

### Final Step: Update Configuration

Now for the most important part. We need to update our central `tools.ts` file to use the new `image-to-pdf` key and update all the text to be consistent.

👉 Please provide me with the code from your `src/constants/tools.ts` file. I will replace the old `jpg-to-pdf` entry with the new, correct `image-to-pdf` configuration.
