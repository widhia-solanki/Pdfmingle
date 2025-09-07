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
import subprocess
import zipfile
import shutil
import webcolors

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}})

# ... (assuming all other routes are here and working correctly) ...

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
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    password = request.form.get('password')
    if not file or not file.filename:
        return jsonify({"error": "No selected file"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400

    try:
        pdf_stream = io.BytesIO(file.read())
        reader = PdfReader(pdf_stream)

        if reader.is_encrypted:
            # Specifically handle incorrect password errors
            try:
                reader.decrypt(password)
            except WrongPasswordError:
                return jsonify({"error": "Incorrect password."}), 403

        # If decryption is successful or file is not encrypted, proceed
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)

        unlocked_stream = io.BytesIO()
        writer.write(unlocked_stream)
        unlocked_stream.seek(0)

        return send_file(
            unlocked_stream,
            as_attachment=True,
            download_name=f"unlocked_{file.filename}",
            mimetype='application/pdf'
        )
    except Exception as e:
        traceback.print_exc()
        # This more descriptive error now correctly fires for non-password related issues
        return jsonify({"error": "Failed to process the PDF. It may be corrupted or use an unsupported format."}), 500

# ... (assuming all other routes are here and working correctly) ...

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)
