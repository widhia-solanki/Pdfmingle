from flask import Flask, request, send_file
from flask_cors import CORS # 1. Import CORS
from PyPDF2 import PdfReader, PdfWriter
import io
from pdf2docx import Converter
from docx2pdf import convert
import tempfile
import os
from pdf2image import convert_from_bytes
import zipfile
import json

app = Flask(__name__)

# 2. Enable CORS for your entire app.
# This tells the server to accept requests from any website.
# For production, you might want to restrict this to just your Vercel URL.
CORS(app) 

@app.route('/compress', methods=['POST'])
def compress_pdf():
    if 'files' not in request.files:
        return "No file part", 400
    
    file = request.files.getlist('files')[0]
    
    if file.filename == '':
        return "No selected file", 400

    if file:
        try:
            input_pdf = PdfReader(file.stream)
            output_pdf = PdfWriter()

            for page in input_pdf.pages:
                output_pdf.add_page(page)

            for page in output_pdf.pages:
                page.compress_content_streams()

            output_buffer = io.BytesIO()
            output_pdf.write(output_buffer)
            output_buffer.seek(0)
            
            return send_file(
                output_buffer,
                as_attachment=True,
                download_name='compressed.pdf',
                mimetype='application/pdf'
            )
        except Exception as e:
            # Add some logging to see errors on the backend
            print(f"An error occurred: {e}")
            return "Error processing PDF", 500

    return "Something went wrong", 500

# This route is useful for checking if the server is running
@app.route('/', methods=['GET'])
def index():
    return "PDFMingle Backend is running!"

@app.route('/pdf-to-word', methods=['POST'])
def pdf_to_word():
    if 'files' not in request.files:
        return "No file part", 400

    file = request.files.getlist('files')[0]

    if file.filename == '':
        return "No selected file", 400

    if file:
        try:
            output_buffer = io.BytesIO()

            # Convert PDF to Word
            cv = Converter(file.stream)
            cv.convert(output_buffer)
            cv.close()

            output_buffer.seek(0)

            filename_without_ext = file.filename.rsplit('.', 1)[0]

            return send_file(
                output_buffer,
                as_attachment=True,
                download_name=f'{filename_without_ext}.docx',
                mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )
        except Exception as e:
            print(f"An error occurred: {e}")
            return "Error processing PDF", 500

    return "Something went wrong", 500

@app.route('/word-to-pdf', methods=['POST'])
def word_to_pdf():
    if 'files' not in request.files:
        return "No file part", 400

    file = request.files.getlist('files')[0]

    if file.filename == '':
        return "No selected file", 400

    if file:
        try:
            with tempfile.TemporaryDirectory() as temp_dir:
                input_path = os.path.join(temp_dir, file.filename)
                file.save(input_path)

                # The output path will be in the same directory
                output_path = os.path.join(temp_dir, file.filename.rsplit('.', 1)[0] + ".pdf")

                convert(input_path, output_path)

                with open(output_path, 'rb') as f:
                    output_buffer = io.BytesIO(f.read())

            filename_without_ext = file.filename.rsplit('.', 1)[0]

            return send_file(
                output_buffer,
                as_attachment=True,
                download_name=f'{filename_without_ext}.pdf',
                mimetype='application/pdf'
            )
        except Exception as e:
            print(f"An error occurred: {e}")
            return "Error processing file", 500

    return "Something went wrong", 500

@app.route('/pdf-to-jpg', methods=['POST'])
def pdf_to_jpg():
    if 'files' not in request.files:
        return "No file part", 400

    file = request.files.getlist('files')[0]

    if file.filename == '':
        return "No selected file", 400

    if file:
        try:
            images = convert_from_bytes(file.read())

            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for i, image in enumerate(images):
                    img_buffer = io.BytesIO()
                    image.save(img_buffer, format='JPEG')
                    img_buffer.seek(0)
                    zip_file.writestr(f'page_{i+1}.jpg', img_buffer.read())

            zip_buffer.seek(0)

            filename_without_ext = file.filename.rsplit('.', 1)[0]

            return send_file(
                zip_buffer,
                as_attachment=True,
                download_name=f'{filename_without_ext}.zip',
                mimetype='application/zip'
            )
        except Exception as e:
            print(f"An error occurred: {e}")
            return "Error processing file", 500

    return "Something went wrong", 500

@app.route('/protect-pdf', methods=['POST'])
def protect_pdf():
    if 'files' not in request.files:
        return "No file part", 400

    file = request.files.getlist('files')[0]
    password = request.form.get('password')

    if file.filename == '':
        return "No selected file", 400

    if not password:
        return "No password provided", 400

    if file:
        try:
            reader = PdfReader(file.stream)
            writer = PdfWriter()

            for page in reader.pages:
                writer.add_page(page)

            writer.encrypt(password)

            output_buffer = io.BytesIO()
            writer.write(output_buffer)
            output_buffer.seek(0)

            filename_without_ext = file.filename.rsplit('.', 1)[0]

            return send_file(
                output_buffer,
                as_attachment=True,
                download_name=f'{filename_without_ext}_protected.pdf',
                mimetype='application/pdf'
            )
        except Exception as e:
            print(f"An error occurred: {e}")
            return "Error processing file", 500

    return "Something went wrong", 500

@app.route('/unlock-pdf', methods=['POST'])
def unlock_pdf():
    if 'files' not in request.files:
        return "No file part", 400

    file = request.files.getlist('files')[0]
    password = request.form.get('password')

    if file.filename == '':
        return "No selected file", 400

    if file:
        try:
            reader = PdfReader(file.stream)

            if reader.is_encrypted:
                if not password:
                    return "Password required for this PDF", 400
                if not reader.decrypt(password):
                    return "Incorrect password", 403 # Forbidden

            writer = PdfWriter()
            for page in reader.pages:
                writer.add_page(page)

            output_buffer = io.BytesIO()
            writer.write(output_buffer)
            output_buffer.seek(0)

            filename_without_ext = file.filename.rsplit('.', 1)[0]

            return send_file(
                output_buffer,
                as_attachment=True,
                download_name=f'{filename_without_ext}_unlocked.pdf',
                mimetype='application/pdf'
            )
        except Exception as e:
            print(f"An error occurred: {e}")
            return "Error processing file", 500

    return "Something went wrong", 500

@app.route('/organize-pdf', methods=['POST'])
def organize_pdf():
    if 'files' not in request.files:
        return "No file part", 400

    file = request.files.getlist('files')[0]
    page_order_str = request.form.get('page_order')

    if file.filename == '':
        return "No selected file", 400

    if not page_order_str:
        return "No page order provided", 400

    if file:
        try:
            page_order = json.loads(page_order_str)

            reader = PdfReader(file.stream)
            writer = PdfWriter()

            for page_num in page_order:
                writer.add_page(reader.pages[page_num - 1])

            output_buffer = io.BytesIO()
            writer.write(output_buffer)
            output_buffer.seek(0)

            filename_without_ext = file.filename.rsplit('.', 1)[0]

            return send_file(
                output_buffer,
                as_attachment=True,
                download_name=f'{filename_without_ext}_organized.pdf',
                mimetype='application/pdf'
            )
        except json.JSONDecodeError:
            return "Invalid page order format", 400
        except IndexError:
            return "Invalid page number in page_order", 400
        except Exception as e:
            print(f"An error occurred: {e}")
            return "Error processing file", 500

    return "Something went wrong", 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
