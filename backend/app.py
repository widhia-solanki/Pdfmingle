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

    # This temporary file approach is the most compatible for complex libraries.
    temp_dir = '/tmp'
    temp_pdf_path = os.path.join(temp_dir, str(uuid.uuid4()) + '.pdf')
    
    try:
        file.save(temp_pdf_path)
        docx_io = io.BytesIO()

        # Use the powerful pdf2docx Converter
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
        # Log the error for our own debugging on Render
        print(f"Error converting file: {e}")
        traceback.print_exc()
        
        # Send a user-friendly error message
        return jsonify({
            "error": "Failed to convert the file. The document might be complex, corrupted, or password-protected."
        }), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=False)```

After you commit these two file changes, Render will rebuild the backend. Please try converting that same PDF of the homepage again. This time, you should see the text and layout preserved in the Word document.
