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

# ... (all other routes remain the same) ...
@app.route('/api/pdf-to-word', methods=['POST'])
def handle_pdf_to_word():
    # ... existing code ...

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
    
    # --- THIS IS THE FIX ---
    # Find the absolute path to the Ghostscript executable. This is robust for server environments.
    gs_path = shutil.which('gs')
    if not gs_path:
        return jsonify({"error": "Ghostscript executable not found on the server."}), 500
        
    try:
        file.save(input_path)
        command = [
            gs_path,  # Use the absolute path
            '-sDEVICE=pdfwrite',
            '-dCompatibilityLevel=1.4',
            f'-dPDFSETTINGS={quality}',
            '-dNOPAUSE',
            '-dQUIET',
            '-dBATCH',
            f'-sOutputFile={output_path}',
            input_path
        ]
        subprocess.run(command, check=True, capture_output=True, text=True)
        
        return send_file(
            output_path, as_attachment=True,
            download_name=f"compressed_{file.filename}", mimetype='application/pdf'
        )
    except subprocess.CalledProcessError as e:
        # Log the actual error from Ghostscript for better debugging
        print("Ghostscript stderr:", e.stderr)
        return jsonify({"error": "Failed to process PDF with Ghostscript.", "details": e.stderr}), 500
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An unexpected error occurred during compression."}), 500
    finally:
        if os.path.exists(input_path): os.remove(input_path)
        if os.path.exists(output_path): os.remove(output_path)

# ... (all other routes remain the same) ...

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)
