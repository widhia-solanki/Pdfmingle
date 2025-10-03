# backend/app.py

from flask import Flask, request, send_file, jsonify, make_response
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
import requests # Make sure this is imported
from datetime import datetime, timedelta, timezone

# --- App Initialization ---
app = Flask(__name__)
bcrypt = Bcrypt(app)

# CORS must be handled by Render Header Rules as discussed
# If you still have CORS issues, add this back:
# from flask_cors import CORS
# CORS(app, origins=["https://pdfmingle.net", "http://localhost:3000"], supports_credentials=True)

# --- Environment Variable Checks ---
if not os.environ.get('JWT_SECRET_KEY'):
    raise ValueError("No JWT_SECRET_KEY set for Flask application")
if not os.environ.get('RECAPTCHA_SECRET_KEY'):
    raise ValueError("RECAPTCHA_SECRET_KEY environment variable not set.")

JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
db = firestore.Client()
users_collection = db.collection('users')

# --- HELPER FUNCTION TO CREATE SESSION ---
def create_session(user_doc):
    payload = { 'sub': user_doc.id, 'iat': datetime.now(timezone.utc), 'exp': datetime.now(timezone.utc) + timedelta(days=7) }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
    user_data = user_doc.to_dict()
    response = make_response(jsonify({ "message": "Login successful", "user": {"email": user_data.get('email')} }), 200)
    response.set_cookie('auth_token', token, httponly=True, secure=True, samesite='Lax', max_age=timedelta(days=7))
    return response

# --- AUTHENTICATION ROUTES ---
@app.route('/api/auth/google', methods=['POST'])
def handle_google_auth():
    # ... (code from previous step)
@app.route('/api/signup', methods=['POST'])
def handle_signup():
    # ... (code from previous step)
@app.route('/api/login', methods=['POST'])
def handle_login():
    # ... (code from previous step)
@app.route('/api/user', methods=['GET'])
def get_current_user():
    # ... (code from previous step)
@app.route('/api/logout', methods=['POST'])
def handle_logout():
    # ... (code from previous step)

# --- NEW SECURE FEEDBACK ROUTE ---
@app.route('/api/feedback', methods=['POST'])
def handle_feedback():
    data = request.get_json()
    
    recaptcha_token = data.get('recaptchaToken')
    if not recaptcha_token:
        return jsonify({"error": "reCAPTCHA token is missing."}), 400

    secret_key = os.environ.get('RECAPTCHA_SECRET_KEY')
    verification_url = "https://www.google.com/recaptcha/api/siteverify"
    verification_payload = {'secret': secret_key, 'response': recaptcha_token}
    
    try:
        verify_response = requests.post(verification_url, data=verification_payload)
        verify_result = verify_response.json()

        if not verify_result.get('success') or verify_result.get('score', 0) < 0.5:
            return jsonify({"error": "reCAPTCHA verification failed. Are you a robot?"}), 403
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "reCAPTCHA server error."}), 500

    feedback_data = data.get('feedback')
    if not feedback_data or 'rating' not in feedback_data or 'page' not in feedback_data:
        return jsonify({"error": "Missing required feedback data"}), 400

    try:
        feedback_data['timestamp'] = firestore.SERVER_TIMESTAMP
        db.collection('feedback').add(feedback_data)
        return jsonify({"message": "Feedback submitted successfully"}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An internal server error occurred."}), 500

# --- EXISTING PDF TOOL ROUTES ---
@app.route('/api/protect-pdf', methods=['POST'])
def handle_protect_pdf():
    # ... (code from previous step)
@app.route('/api/unlock-pdf', methods=['POST'])
def handle_unlock_pdf():
    # ... (code from previous step)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)
