# backend/app.py

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
from PyPDF2 import PdfReader, PdfWriter
from PyPDF2.errors import WrongPasswordError
from PIL import Image
from pdf2image import convert_from_path
import docx
import fitz  # PyMuPDF
import io
import os
import uuid
import traceback
import subprocess # <-- Required for calling qpdf
import shutil
import webcolors

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})

# ... (all other working routes) ...

@app.route('/api/protect-pdf', methods=['POST'])
def handle_protect_pdf():
    # ... (this function remains the same)
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
    # A blank password is valid for some PDFs, so we check for None
    if password is None: return jsonify({"error": "Password must be provided"}), 400

    # Create a unique temporary directory for this request
    temp_dir = f"/tmp/{uuid.uuid4()}"
    os.makedirs(temp_dir, exist_ok=True)
    input_path = os.path.join(temp_dir, file.filename)
    output_path = os.path.join(temp_dir, f"unlocked_{file.filename}")

    try:
        file.save(input_path)

        # Construct and run the qpdf command
        command = [
            'qpdf',
            '--password=' + password,
            '--decrypt',
            input_path,
            output_path
        ]
        
        # Execute the command
        result = subprocess.run(command, capture_output=True, text=True)

        # Check for errors from qpdf
        if result.returncode != 0:
            if 'invalid password' in result.stderr.lower():
                return jsonify({"error": "Incorrect password."}), 403
            else:
                # Provide a more detailed error for debugging if available
                error_details = result.stderr.strip()
                print(f"qpdf error: {error_details}")
                return jsonify({"error": f"Failed to process the PDF. It may be corrupted or unsupported."}), 500

        # If successful, send the unlocked file back
        return send_file(
            output_path,
            as_attachment=True,
            download_name=f"unlocked_{file.filename}",
            mimetype='application/pdf'
        )
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An unexpected server error occurred."}), 500
    finally:
        # IMPORTANT: Clean up the temporary directory and files
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

# ... (all other working routes) ...

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)
