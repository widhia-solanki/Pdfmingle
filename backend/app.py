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
        positioning = request.form.get('positioning', 'tiled') # 'tiled' or 'single'

        if watermark_type == 'text':
            text = request.form.get('text', 'WATERMARK')
            color_hex = request.form.get('color', '#000000')
            rgb_color = webcolors.hex_to_rgb(color_hex)
            color_tuple = tuple(c / 255.0 for c in rgb_color)
            font_size = int(request.form.get('fontSize', 48))
            
            for page in doc:
                rect = page.rect
                if positioning == 'tiled':
                    step_x = font_size * len(text) * 0.4
                    step_y = font_size * 2
                    for y in range(int(rect.y0), int(rect.y1), int(step_y)):
                        for x in range(int(rect.x0), int(rect.x1), int(step_x)):
                            page.insert_textbox(fitz.Rect(x, y, x + step_x, y + step_y), text, 
                                                fontsize=font_size, color=color_tuple, 
                                                rotate=rotation, opacity=opacity, align=fitz.TEXT_ALIGN_CENTER)
                else: # single position
                    position = request.form.get('position', 'center')
                    tw = fitz.TextWriter(page.rect, color=color_tuple, opacity=opacity, fontsize=font_size)
                    
                    text_width = fitz.get_text_length(text, fontsize=font_size)
                    
                    if position == 'top-left': pos = fitz.Point(20, font_size + 20)
                    elif position == 'top-right': pos = fitz.Point(rect.width - text_width - 20, font_size + 20)
                    elif position == 'bottom-left': pos = fitz.Point(20, rect.height - 20)
                    elif position == 'bottom-right': pos = fitz.Point(rect.width - text_width - 20, rect.height - 20)
                    else: pos = fitz.Point(rect.width/2 - text_width/2, rect.height/2 + font_size/2) # Center
                    
                    tw.append(pos, text, rotate=rotation)
                    tw.write_text(page)

        elif watermark_type == 'image':
            if 'watermarkImage' not in request.files:
                return jsonify({"error": "No watermark image provided."}), 400
            
            image_file = request.files['watermarkImage']
            img_bytes = image_file.read()
            
            img_width, img_height = 150, 150 # Default watermark size

            for page in doc:
                rect = page.rect
                if positioning == 'tiled':
                    step_x, step_y = 200, 200
                    for y in range(int(rect.y0), int(rect.y1), step_y):
                        for x in range(int(rect.x0), int(rect.x1), step_x):
                           page.insert_image(fitz.Rect(x, y, x + img_width, y + img_height), stream=img_bytes, 
                                             rotate=rotation, opacity=opacity, keep_proportion=True)
                else: # single position
                    position = request.form.get('position', 'center')
                    
                    if position == 'top-left': img_rect = fitz.Rect(20, 20, img_width + 20, img_height + 20)
                    elif position == 'top-right': img_rect = fitz.Rect(rect.width - img_width - 20, 20, rect.width - 20, img_height + 20)
                    elif position == 'bottom-left': img_rect = fitz.Rect(20, rect.height - img_height - 20, img_width + 20, rect.height - 20)
                    elif position == 'bottom-right': img_rect = fitz.Rect(rect.width - img_width - 20, rect.height - img_height - 20, rect.width - 20, rect.height - 20)
                    else: # Center
                        img_rect = fitz.Rect(0, 0, img_width, img_height)
                        img_rect.center = rect.center
                    
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
