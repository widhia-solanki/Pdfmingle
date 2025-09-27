# backend/app.py

from flask import Flask, request, send_file, jsonify, make_response
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from PyPDF2 import PdfReader, PdfWriter
import jwt
from google.cloud import firestore
from google_auth_oauthlib.flow import Flow
import os
import io
import json
import uuid
import traceback
import subprocess
import shutil
from datetime import datetime, timedelta, timezone

app = Flask(__name__)
bcrypt = Bcrypt(app)

CORS(app, origins=["https://pdfmingle.net", "http://localhost:3000"], supports_credentials=True)

# --- Environment Variable Checks ---
if not os.environ.get('JWT_SECRET_KEY'):
    raise ValueError("No JWT_SECRET_KEY set for Flask application")
# The GOOGLE_APPLICATION_CREDENTIALS variable is now handled automatically by the library

JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')

# --- THIS IS THE FIX ---
# This will now automatically find and use the GOOGLE_APPLICATION_CREDENTIALS path
db = firestore.Client()
users_collection = db.collection('users')


# ... (The rest of your file is now correct and does not need to change) ...

def create_session(user_doc):
    # ... (unchanged)

@app.route('/api/auth/google', methods=['POST'])
def handle_google_auth():
    data = request.get_json()
    auth_code = data.get('code')
    if not auth_code: return jsonify({"error": "Authorization code is missing"}), 400
        
    try:
        # This will also automatically find and use the credentials
        flow = Flow.from_client_secrets_file(
            os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'),
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/drive.file'],
            redirect_uri='postmessage'
        )
        flow.fetch_token(code=auth_code)
        # ... (rest of function is the same)
        
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Google authentication failed."}), 500

# ... (All other routes remain the same) ...

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)
