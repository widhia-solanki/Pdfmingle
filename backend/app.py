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

CORS(app, resources={r"/api/*": {"origins": "*"}})

# ... (all other routes like /ping, /pdf-to-word, etc. remain the same) ...

@app.route('/api/compress-pdf', methods=['POST'])
def handle_compress_pdf():
    if 'file' not in request.files: return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    level = request.form.get('level', 'medium')
    if not file or not file.filename: return jsonify({"error": "No selected file"}), 400
    if not file.filename.lower().endswith('.pdf'): return jsonify({"error": "Invalid file type"}), 400
    
    # --- THIS IS THE FIX ---
    # We now use specific DPI settings for granular control over compression.
    # This provides a much more noticeable difference between levels.
    quality_settings = {
        'high': '72',   # Extreme compression (e.g., for screen)
        'medium': '150', # Balanced compression (e.g., for standard sharing)
        'low': '300'    # Low compression (e.g., for print quality)
    }
    dpi = quality_settings.get(level, '150') # Default to medium
    
    temp_dir = '/tmp'
    input_path = os.path.join(temp_dir, str(uuid.uuid4()) + '_input.pdf')
    output_path = os.path.join(temp_dir, str(uuid.uuid4()) + '_output.pdf')
    
    gs_path = shutil.which('gs')
    if not gs_path:
        return jsonify({"error": "Ghostscript executable not found on the server."}), 500
        
    try:
        file.save(input_path)
        
        # This is a more powerful and effective Ghostscript command for compression.
        command = [
            gs_path,
            '-sDEVICE=pdfwrite',
            '-dCompatibilityLevel=1.5',
            '-dNOPAUSE',
            '-dQUIET',
            '-dBATCH',
            '-dColorImageResolution=' + dpi,
            '-dGrayImageResolution=' + dpi,
            '-dMonoImageResolution=' + dpi,
            '-dColorImageDownsampleType=/Bicubic',
            '-dGrayImageDownsampleType=/Bicubic',
            '-dMonoImageDownsampleType=/Bicubic',
            f'-sOutputFile={output_path}',
            input_path
        ]

        subprocess.run(command, check=True, capture_output=True, text=True)
        
        # Check if the output file was actually created and has size
        if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
            raise Exception("Ghostscript failed to create a valid output file.")

        return send_file(
            output_path, as_attachment=True,
            download_name=f"compressed_{file.filename}", mimetype='application/pdf'
        )
    except subprocess.CalledProcessError as e:
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
