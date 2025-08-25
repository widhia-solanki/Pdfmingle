from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
import io
import os
import uuid
import traceback

app = Flask(__name__)

# --- CONFIGURATION ---
# This configuration correctly allows your frontend to communicate with the backend.
# We'll also add your www subdomain just in case.
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "https://pdfmingle.net", "https://www.pdfmingle.net"]}})

@app.route('/')
def index():
    """A simple health check endpoint."""
    return jsonify({"message": "PDFMingle Backend is running!"})

@app.route('/pdf-to-word', methods=['POST'])
def handle_pdf_to_word():
    """
    Handles the PDF to DOCX conversion.
    Receives a PDF, saves it temporarily, converts it, and sends back the DOCX.
    """
    if 'files' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files.get('files')

    if not file or not file.filename:
        return jsonify({"error": "No selected file"}), 400

    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"error": "Invalid file type, please upload a PDF"}), 400

    # Use Render's temporary directory for robust file handling
    # Render provides a writable directory at /tmp
    temp_dir = '/tmp' 
    if not os.path.exists(temp_dir):
        # In some environments, we might need to create it
        os.makedirs(temp_dir, exist_ok=True)
    
    unique_filename = str(uuid.uuid4())
    temp_pdf_path = os.path.join(temp_dir, f"{unique_filename}.pdf")
    
    try:
        # Save the uploaded PDF to the temporary path
        file.save(temp_pdf_path)

        # --- THIS IS THE FIX ---
        # Instead of a temporary output path, we'll convert directly to an in-memory BytesIO object.
        # This is more efficient and avoids potential filesystem permission issues.
        docx_io = io.BytesIO()

        # Initialize the converter with the saved file path
        cv = Converter(temp_pdf_path)
        # Convert the PDF and write the output DOCX to our in-memory object
        cv.convert(docx_io)
        cv.close()
        
        # Go to the beginning of the in-memory file so `send_file` can read it from the start
        docx_io.seek(0)
        
        original_filename = file.filename.rsplit('.', 1)[0]

        return send_file(
            docx_io,
            as_attachment=True,
            download_name=f"{original_filename}.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except Exception as e:
        # Log the full error for debugging in Render's logs
        error_details = traceback.format_exc()
        print(f"Error converting file: {e}")
        print(f"Traceback: {error_details}")
        return jsonify({
            "error": "Failed to convert the file. The document might be complex, corrupted, or password-protected."
        }), 500
    finally:
        # This cleanup step is still crucial to prevent the server from filling up with old files.
        if os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)

if __name__ == '__main__':
    # Use '0.0.0.0' to be accessible within the Render network
    # Render sets the PORT environment variable automatically
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=False)
