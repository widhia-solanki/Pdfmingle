# backend/app.py

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
import io
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

    try:
        # --- THIS IS THE FIX ---
        # 1. Read the entire file stream into an in-memory buffer.
        pdf_bytes = io.BytesIO(file.read())
        
        # 2. Create a separate in-memory buffer for the output.
        docx_io = io.BytesIO()

        # 3. Pass the memory buffer to the Converter.
        cv = Converter(pdf_bytes)
        cv.convert(docx_io)
        cv.close()
        
        # 4. Rewind the output buffer to the beginning before sending.
        docx_io.seek(0)

        return send_file(
            docx_io,
            as_attachment=True,
            download_name=f"{file.filename.rsplit('.', 1)[0]}.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except Exception as e:
        # We can leave the detailed error logging for now
        error_details = traceback.format_exc()
        print(f"Error converting file: {e}")
        print(f"Traceback: {error_details}")
        return jsonify({
            "error": "Failed to convert the file.",
            "details": str(e),
            "traceback": error_details 
        }), 500


if __name__ == '__main__':
    app.run(debug=False)
