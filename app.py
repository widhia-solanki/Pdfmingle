from flask import Flask, request, send_file
from PyPDF2 import PdfReader, PdfWriter
import io

app = Flask(__name__)

@app.route('/compress', methods=['POST'])
def compress_pdf():
    # Check if a file was sent
    if 'files' not in request.files:
        return "No file part", 400
    
    file = request.files.getlist('files')[0]
    
    if file.filename == '':
        return "No selected file", 400

    if file:
        # Read the uploaded PDF file from memory
        input_pdf = PdfReader(file.stream)
        output_pdf = PdfWriter()

        # Copy all pages to the new PDF
        for page in input_pdf.pages:
            output_pdf.add_page(page)

        # This is where the magic happens: compress the content
        # This is a lossless compression, good for text and vector graphics
        for page in output_pdf.pages:
            page.compress_content_streams()

        # Save the compressed PDF to a memory buffer
        output_buffer = io.BytesIO()
        output_pdf.write(output_buffer)
        output_buffer.seek(0)
        
        return send_file(
            output_buffer,
            as_attachment=True,
            download_name='compressed.pdf',
            mimetype='application/pdf'
        )

    return "Something went wrong", 500

if __name__ == '__main__':
    # This is for local testing, Render will use its own command to run the app
    app.run(debug=True, port=5001)
