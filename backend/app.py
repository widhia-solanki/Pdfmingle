# backend/app.py

from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pdf2docx import Converter
from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
from pdf2image import convert_from_path
import docx
import fitz  # PyMuPDF
import io
import os
import uuid
import traceback
import subprocess
import zipfile
import shutil
import webcolors

app = Flask(__name__)

# Allow all origins for Vercel preview deployments and local development
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/ping', methods=['GET'])
def ping():
    return jsonify({"message": "pong"}), 200

# ... (all your other existing routes like /api/crop-pdf, /api/protect-pdf, etc.)

@app.route('/api/add-watermark', methods=['POST'])
def handle_add_watermark():
    if 'file' not in request.files:
        return jsonify({"error": "No PDF file part."}), 400
    
    pdf_file = request.files['file']
    watermark_type = request.form.get('type')
    
    try:
        pdf_bytes = pdf_file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")

        opacity = float(request.form.get('opacity', 0.5))
        rotation = int(request.form.get('rotation', 0))
        is_tiled = request.form.get('isTiled') == 'true'

        if watermark_type == 'text':
            text = request.form.get('text', 'WATERMARK')
            color_hex = request.form.get('color', '#000000')
            rgb_color = webcolors.hex_to_rgb(color_hex)
            color_tuple = tuple(c / 255.0 for c in rgb_color)
            font_size = int(request.form.get('fontSize', 48))
            
            for page in doc:
                rect = page.rect
                if is_tiled:
                    # Tiling logic for text
                    step_x = font_size * len(text) * 0.4
                    step_y = font_size * 2
                    for y in range(int(rect.y0), int(rect.y1), int(step_y)):
                        for x in range(int(rect.x0), int(rect.x1), int(step_x)):
                            page.insert_textbox(fitz.Rect(x, y, x + step_x, y + step_y), text, 
                                                fontsize=font_size, color=color_tuple, 
                                                rotate=rotation, opacity=opacity, align=fitz.TEXT_ALIGN_CENTER)
                else:
                    # Centered, single text
                    page.insert_textbox(rect, text, fontsize=font_size, color=color_tuple, 
                                        rotate=rotation, opacity=opacity, align=fitz.TEXT_ALIGN_CENTER)
        
        elif watermark_type == 'image':
            if 'watermarkImage' not in request.files:
                return jsonify({"error": "No watermark image provided."}), 400
            
            image_file = request.files['watermarkImage']
            img_bytes = image_file.read()

            for page in doc:
                rect = page.rect
                img_rect = fitz.Rect(0, 0, 150, 150) # default size for the watermark image
                img_rect.center = rect.center
                
                if is_tiled:
                    # Tiling logic for images
                    step_x = 200
                    step_y = 200
                    for y in range(int(rect.y0), int(rect.y1), step_y):
                        for x in range(int(rect.x0), int(rect.x1), step_x):
                           page.insert_image(fitz.Rect(x, y, x + 150, y + 150), stream=img_bytes, 
                                             rotate=rotation, opacity=opacity, keep_proportion=True)
                else:
                    # Centered, single image
                    page.insert_image(img_rect, stream=img_bytes, rotate=rotation, 
                                      opacity=opacity, keep_proportion=True)
        else:
            return jsonify({"error": "Invalid watermark type specified."}), 400
            
        output_stream = io.BytesIO()
        doc.save(output_stream, garbage=4, deflate=True, clean=True)
        doc.close()
        output_stream.seek(0)
        
        return send_file(
            output_stream, as_attachment=True,
            download_name=f"watermarked_{pdf_file.filename}", mimetype='application/pdf'
        )

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An error occurred while adding the watermark.", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)
