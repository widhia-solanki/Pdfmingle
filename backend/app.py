# backend/app.py

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
import io

# Initialize the Flask app
app = Flask(__name__)

# Configure CORS to allow requests from your Vercel frontend
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://pdfmingle.net"]}})

# Health check route to confirm the server is running
@app.route('/')
def index():
    return jsonify({"message": "PDFMingle Backend is running!"})

# PDF to Word conversion route
@app.route('/pdf-to-word', methods=['POST'])
def handle_pdf_to_word():
    # Check if a file was uploaded
    if 'files' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files.get('files')

    # Check for a valid file
    if not file or not file.filename:
        return jsonify({"error": "Invalid file"}), 400

    # Check if the file is a PDF
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Invalid file type, please upload a PDF"}), 400

    try:
        # Perform the conversion in memory
        docx_io = io.BytesIO()
        cv = Converter(file.stream)
        cv.convert(docx_io)
        cv.close()
        docx_io.seek(0) # Go back to the start of the in-memory file

        # Send the converted file back to the user for download
        return send_file(
            docx_io,
            as_attachment=True,
            download_name=f"{file.filename.rsplit('.', 1)[0]}.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except Exception as e:
        # Log the error for debugging and send a generic error message
        print(f"Error converting file: {e}")
        return jsonify({"error": "Failed to convert the file."}), 500

# This line is needed for Render to run the app with gunicorn
if __name__ == '__main__':
    app.run(debug=False)
