# backend/app.py

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
import io
import traceback # Import the traceback module

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
        docx_io = io.BytesIO()
        cv = Converter(file.stream)
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
        # --- THIS IS THE FIX ---
        # We now capture the detailed error and send it back in the JSON response.
        # This will tell us exactly what's going wrong inside the Converter.
        error_details = traceback.format_exc()
        print(f"Error converting file: {e}")
        print(f"Traceback: {error_details}")
        return jsonify({
            "error": "Failed to convert the file.",
            "details": str(e), # Sending the specific error message
            "traceback": error_details # Sending the full error stack
        }), 500


if __name__ == '__main__':
    app.run(debug=False)
