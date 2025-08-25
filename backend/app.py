from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
from pdf2image import convert_from_path
# No longer importing from docx2pdf
import io
import os
import uuid
import traceback
import subprocess
import zipfile
import shutil

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://pdfmingle.net", "https://www.pdfmingle.net"]}})

@app.route('/')
def index():
    return jsonify({"message": "PDFMingle Backend is running!"})

# --- ALL PREVIOUS, WORKING ENDPOINTS ---
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

@app.route('/protect-pdf', methods=['POST'])
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

@app.route('/unlock-pdf', methods=['POST'])
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

@app.route('/image-to-pdf', methods=['POST'])
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

@app.route('/pdf-to-image', methods=['POST'])
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


# --- REWRITTEN WORD TO PDF ENDPOINT ---
@app.route('/word-to-pdf', methods=['POST'])
def handle_word_to_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if not file or not file.filename:
        return jsonify({"error": "No file selected"}), 400
    if not file.filename.lower().endswith(('.doc', '.docx')):
        return jsonify({"error": "Invalid file type. Please upload a Word document."}), 400

    # Create a unique directory for this specific conversion job.
    job_dir = os.path.join('/tmp', str(uuid.uuid4()))
    os.makedirs(job_dir, exist_ok=True)
    input_path = os.path.join(job_dir, file.filename)
    
    try:
        file.save(input_path)

        # This is the direct command to call LibreOffice
        command = [
            'libreoffice',
            '--headless',           # Run without a GUI
            '--convert-to', 'pdf',   # Specify the output format
            '--outdir', job_dir,     # Set the output directory
            input_path              # The input file
        ]
        
        # Run the command and raise an error if it fails
        subprocess.run(command, check=True, timeout=30) # Add a 30-second timeout for safety
        
        output_filename = os.path.splitext(os.path.basename(input_path))[0] + ".pdf"
        output_path = os.path.join(job_dir, output_filename)

        if not os.path.exists(output_path):
             raise Exception("Conversion failed: output PDF not found.")

        return send_file(
            output_path,
            as_attachment=True,
            download_name=f"{os.path.splitext(file.filename)[0]}.pdf",
            mimetype='application/pdf'
        )
    except subprocess.TimeoutExpired:
        return jsonify({"error": "Conversion timed out. The file might be too large or complex."}), 500
    except subprocess.CalledProcessError as e:
        print(f"LibreOffice Error converting Word to PDF: {e}")
        return jsonify({"error": "The document could not be converted."}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        traceback.print_exc()
        return jsonify({"error": "An unexpected server error occurred."}), 500
    finally:
        # Clean up the entire temporary job directory
        if os.path.exists(job_dir):
            shutil.rmtree(job_dir)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=False)
