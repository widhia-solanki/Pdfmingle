from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
import io
import os
import uuid
import traceback

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://pdfmingle.net", "https://www.pdfmingle.net"]}})

@app.route('/')
def index():
    return jsonify({"message": "PDFMingle Backend is running!"})

@app.route('/pdf-to-word', methods=['POST'])
def handle_pdf_to_word():
    if 'files' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files.get('files')

    if not file or not file.filename:
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Invalid file type, please upload a PDF"}), 400

    # Let's go back to the most robust method: saving the file to a temporary location first.
    # This is often more compatible with external libraries than in-memory streams.
    temp_dir = '/tmp'
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir, exist_ok=True)
    
    temp_pdf_path = os.path.join(temp_dir, str(uuid.uuid4()) + '.pdf')
    
    try:
        file.save(temp_pdf_path)
        docx_io = io.BytesIO()

        cv = Converter(temp_pdf_path)
        cv.convert(docx_io)
        cv.close()
        
        docx_io.seek(0)
        
        original_filename = file.filename.rsplit('.', 1)[0]

        return send_file(
            docx_io,
            as_attachment=True,
            download_name=f"{original_filename}.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except Exception as e:
        # --- THIS IS THE CRITICAL FIX ---
        # We capture the full, detailed traceback of the crash.
        error_details = traceback.format_exc()
        print(f"CRITICAL ERROR converting file: {e}")
        print(f"TRACEBACK: {error_details}")
        
        # We now send these details back to the frontend for debugging.
        return jsonify({
            "error": "Failed to convert the file. The document might be complex, corrupted, or password-protected.",
            "details": str(e),
            "traceback": error_details 
        }), 500
    finally:
        if os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=False)
