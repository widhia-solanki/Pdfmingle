# backend/app.py

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
import io
import os
import uuid
import traceback

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://pdfmingle.net"]}})

@app.route('/')
def index():
    return jsonify({"message": "PDFMingle Backend is running!"})

@app.route('/pdf-to-word', methods=['POST'])
def handle_pdf_to_word():
    if 'files' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files.get('files')

    if not file or not file.filename:
        return jsonify({"error": "Invalid file"}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Invalid file type, please upload a PDF"}), 400

    # --- THIS IS THE NEW, MORE ROBUST LOGIC ---
    # We will save the file to a temporary location first
    temp_dir = '/tmp' # Render provides a temporary directory at /tmp
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    unique_filename = str(uuid.uuid4()) + '.pdf'
    temp_pdf_path = os.path.join(temp_dir, unique_filename)
    
    try:
        # Save the uploaded file to the temporary path
        file.save(temp_pdf_path)

        # Create an in-memory buffer for the output DOCX
        docx_io = io.BytesIO()

        # Process the file from its temporary path
        cv = Converter(temp_pdf_path)
        cv.convert(docx_io)
        cv.close()
        
        docx_io.seek(0)

        return send_file(
            docx_io,
            as_attachment=True,
            download_name=f"{file.filename.rsplit('.', 1)[0]}.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except Exception as e:
        # The detailed error logging is still here to help us
        error_details = traceback.format_exc()
        print(f"Error converting file: {e}")
        print(f"Traceback: {error_details}")
        return jsonify({
            "error": "Failed to convert the file.",
            "details": str(e),
            "traceback": error_details 
        }), 500
    finally:
        # --- IMPORTANT ---
        # This 'finally' block ensures the temporary file is deleted
        # even if the conversion fails.
        if os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)


if __name__ == '__main__':
    app.run(debug=False)
