from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
import io
import os
import uuid
import traceback

app = Flask(__name__)

# This CORS configuration is correct and will work once the 500 error is solved.
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://pdfmingle.net", "https://www.pdfmingle.net"]}})

@app.route('/')
def index():
    """A simple health check endpoint."""
    return jsonify({"message": "PDFMingle Backend is running!"})

@app.route('/pdf-to-word', methods=['POST'])
def handle_pdf_to_word():
    """
    Handles the PDF to DOCX conversion entirely in-memory to avoid filesystem issues.
    """
    if 'files' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files.get('files')

    if not file or not file.filename:
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Invalid file type, please upload a PDF"}), 400

    try:
        # --- THIS IS THE NEW FIX ---
        # Read the uploaded file directly into an in-memory bytes buffer
        pdf_stream = io.BytesIO(file.read())
        
        # Create another in-memory buffer for the output DOCX
        docx_stream = io.BytesIO()

        # Initialize the converter using the in-memory PDF stream
        cv = Converter(pdf_stream)
        # Convert and write the output to the in-memory DOCX stream
        cv.convert(docx_stream)
        cv.close()
        
        # Go to the beginning of the in-memory DOCX stream so it can be sent
        docx_stream.seek(0)
        
        original_filename = file.filename.rsplit('.', 1)[0]

        return send_file(
            docx_stream,
            as_attachment=True,
            download_name=f"{original_filename}.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except Exception as e:
        # This logging is crucial for us to see the real error in Render's logs
        error_details = traceback.format_exc()
        print(f"Error converting file: {e}")
        print(f"Traceback: {error_details}")
        return jsonify({
            "error": "Failed to convert the file. The document might be complex, corrupted, or password-protected."
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=False)
