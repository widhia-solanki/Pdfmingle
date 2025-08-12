from flask import Flask, request, send_file
from flask_cors import CORS # 1. Import CORS
from PyPDF2 import PdfReader, PdfWriter
import io

app = Flask(__name__)

# 2. Enable CORS for your entire app.
# This tells the server to accept requests from any website.
# For production, you might want to restrict this to just your Vercel URL.
CORS(app) 

@app.route('/compress', methods=['POST'])
def compress_pdf():
    if 'files' not in request.files:
        return "No file part", 400
    
    file = request.files.getlist('files')[0]
    
    if file.filename == '':
        return "No selected file", 400

    if file:
        try:
            input_pdf = PdfReader(file.stream)
            output_pdf = PdfWriter()

            for page in input_pdf.pages:
                output_pdf.add_page(page)

            for page in output_pdf.pages:
                page.compress_content_streams()

            output_buffer = io.BytesIO()
            output_pdf.write(output_buffer)
            output_buffer.seek(0)
            
            return send_file(
                output_buffer,
                as_attachment=True,
                download_name='compressed.pdf',
                mimetype='application/pdf'
            )
        except Exception as e:
            # Add some logging to see errors on the backend
            print(f"An error occurred: {e}")
            return "Error processing PDF", 500

    return "Something went wrong", 500

# This route is useful for checking if the server is running
@app.route('/', methods=['GET'])
def index():
    return "PDFMingle Backend is running!"

if __name__ == '__main__':
    app.run(debug=True, port=5001)
