from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
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

@app.route('/pdf-to-word', methods=['POST'])
def handle_pdf_to_word():
    # (This is our existing, working pdf-to-word code)
    if 'files' not in request.files:
        return jsonify({"error": "No file part"}), 400
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

# --- NEW COMPRESS PDF ENDPOINT ---
@app.route('/compress-pdf', methods=['POST'])
def handle_compress_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    level = request.form.get('level', 'medium') # low, medium, high

    if not file or not file.filename:
        return jsonify({"error": "No selected file"}), 400
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Invalid file type"}), 400

    # Map our friendly level names to ghostscript settings
    gs_settings = {
        'low': '/ebook',      # Lower quality, smaller size
        'medium': '/default', # A good balance
        'high': '/printer'    # Higher quality, larger size
    }
    quality = gs_settings.get(level, '/default')

    temp_dir = '/tmp'
    input_path = os.path.join(temp_dir, str(uuid.uuid4()) + '_input.pdf')
    output_path = os.path.join(temp_dir, str(uuid.uuid4()) + '_output.pdf')

    try:
        file.save(input_path)

        # This is the powerful ghostscript command that does the compression
        command = [
            'gs', '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
            f'-dPDFSETTINGS={quality}', '-dNOPAUSE', '-dQUIET', '-dBATCH',
            f'-sOutputFile={output_path}', input_path
        ]
        
        subprocess.run(command, check=True)

        return send_file(
            output_path,
            as_attachment=True,
            download_name=f"compressed_{file.filename}",
            mimetype='application/pdf'
        )
    except subprocess.CalledProcessError as e:
        print(f"Ghostscript Error: {e}")
        traceback.print_exc()
        return jsonify({"error": "Failed to process PDF with Ghostscript."}), 500
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        traceback.print_exc()
        return jsonify({"error": "An unexpected server error occurred."}), 500
    finally:
        # Clean up both temporary files
        if os.path.exists(input_path): os.remove(input_path)
        if os.path.exists(output_path): os.remove(output_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=False)
