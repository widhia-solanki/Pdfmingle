from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import io
import traceback
import pdfplumber
from docx import Document

app = Flask(__name__)

# This CORS configuration is correct.
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://pdfmingle.net", "https://www.pdfmingle.net"]}})

@app.route('/')
def index():
    """A simple health check endpoint."""
    return jsonify({"message": "PDFMingle Backend is running!"})

@app.route('/pdf-to-word', methods=['POST'])
def handle_pdf_to_word():
    """
    Handles PDF to DOCX conversion using the lightweight pdfplumber library.
    """
    if 'files' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files.get('files')

    if not file or not file.filename:
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Invalid file type, please upload a PDF"}), 400

    try:
        # Read the uploaded file directly into an in-memory bytes buffer
        pdf_stream = io.BytesIO(file.read())
        
        # Create a new Word document in memory
        document = Document()
        
        # Use pdfplumber to open the in-memory PDF
        with pdfplumber.open(pdf_stream) as pdf:
            # Loop through each page, extract text, and add it to the Word doc
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    document.add_paragraph(text)
                # Add a page break after each page except the last one
                if page.page_number < len(pdf.pages):
                    document.add_page_break()

        # Save the Word document to an in-memory stream
        docx_stream = io.BytesIO()
        document.save(docx_stream)
        docx_stream.seek(0)
        
        original_filename = file.filename.rsplit('.', 1)[0]

        return send_file(
            docx_stream,
            as_attachment=True,
            download_name=f"{original_filename}.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except Exception as e:
        # Log the error for debugging
        print(f"Error converting file with pdfplumber: {e}")
        traceback.print_exc()
        
        return jsonify({
            "error": "Failed to convert the file. The document might be complex, corrupted, or password-protected."
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=False)
