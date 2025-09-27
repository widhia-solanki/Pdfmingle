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
from datetime import datetime, timedelta, timezone

# --- App Initialization ---
app = Flask(__name__)
bcrypt = Bcrypt(app)

# --- Environment Variable Checks ---
if not os.environ.get('JWT_SECRET_KEY'):
    raise ValueError("No JWT_SECRET_KEY set for Flask application")
if not os.environ.get('GOOGLE_CLIENT_SECRET_JSON'):
    raise ValueError("GOOGLE_CLIENT_SECRET_JSON environment variable not set.")

JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
db = firestore.Client()
users_collection = db.collection('users')


# --- DEFINITIVE CORS FIX: MANUAL CORS HANDLING ---
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    allowed_origins = ["https://pdfmingle.net", "http://localhost:3000"]
    
    if origin in allowed_origins:
        response.headers['Access-Control-Allow-Origin'] = origin
    
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    
    return response

# --- HELPER FUNCTION TO CREATE SESSION ---
def create_session(user_doc):
    payload = { 'sub': user_doc.id, 'iat': datetime.now(timezone.utc), 'exp': datetime.now(timezone.utc) + timedelta(days=7) }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
    user_data = user_doc.to_dict()
    response = make_response(jsonify({ "message": "Login successful", "user": {"email": user_data.get('email')} }), 200)
    response.set_cookie('auth_token', token, httponly=True, secure=True, samesite='Lax', max_age=timedelta(days=7))
    return response


# --- AUTHENTICATION ROUTES ---
@app.route('/api/auth/google', methods=['POST', 'OPTIONS'])
def handle_google_auth():
    if request.method == 'OPTIONS': return make_response('', 204)
    data = request.get_json()
    auth_code = data.get('code')
    if not auth_code: return jsonify({"error": "Authorization code is missing"}), 400
    try:
        client_secrets_str = os.environ.get('GOOGLE_CLIENT_SECRET_JSON')
        client_config = json.loads(client_secrets_str)
        flow = Flow.from_client_config(client_config, scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/drive.file'], redirect_uri='postmessage')
        flow.fetch_token(code=auth_code)
        credentials = flow.credentials
        id_info = jwt.decode(credentials.id_token, options={"verify_signature": False})
        email = id_info.get('email').lower()
        user_query = users_collection.where('email', '==', email).limit(1).get()
        user_list = list(user_query)
        if user_list:
            user_doc = user_list[0]
        else:
            user_data = {'email': email, 'name': id_info.get('name'), 'provider': 'google', 'createdAt': firestore.SERVER_TIMESTAMP}
            _, user_doc_ref = users_collection.add(user_data)
            user_doc = user_doc_ref.get()
        return create_session(user_doc)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An unexpected server error during Google authentication."}), 500

@app.route('/api/signup', methods=['POST', 'OPTIONS'])
def handle_signup():
    if request.method == 'OPTIONS': return make_response('', 204)
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'): return jsonify({"error": "Email and password are required"}), 400
    email = data.get('email').lower()
    password = data.get('password')
    existing_user = users_collection.where('email', '==', email).limit(1).get()
    if list(existing_user): return jsonify({"error": "An account with this email already exists"}), 409
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user_data = {'email': email, 'password': hashed_password, 'provider': 'email', 'createdAt': firestore.SERVER_TIMESTAMP}
    users_collection.add(user_data)
    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def handle_login():
    if request.method == 'OPTIONS': return make_response('', 204)
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'): return jsonify({"error": "Email and password are required"}), 400
    email = data.get('email').lower()
    password = data.get('password')
    user_query = users_collection.where('email', '==', email).limit(1).get()
    user_list = list(user_query)
    if not user_list: return jsonify({"error": "Invalid credentials"}), 401
    user_doc = user_list[0]
    user_data = user_doc.to_dict()
    if not user_data.get('password') or not bcrypt.check_password_hash(user_data.get('password'), password):
        return jsonify({"error": "Invalid credentials"}), 401
    return create_session(user_doc)

@app.route('/api/user', methods=['GET', 'OPTIONS'])
def get_current_user():
    if request.method == 'OPTIONS': return make_response('', 204)
    token = request.cookies.get('auth_token')
    if not token: return jsonify({"error": "Not authenticated"}), 401
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        user_id = payload['sub']
        user_doc = users_collection.document(user_id).get()
        if not user_doc.exists: return jsonify({"error": "User not found"}), 401
        user_data = user_doc.to_dict()
        return jsonify({"user": {"email": user_data.get('email')}}), 200
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"error": "Invalid or expired token"}), 401

@app.route('/api/logout', methods=['POST', 'OPTIONS'])
def handle_logout():
    if request.method == 'OPTIONS': return make_response('', 204)
    response = make_response(jsonify({"message": "Logout successful"}), 200)
    response.set_cookie('auth_token', '', expires=0, httponly=True, secure=True, samesite='Lax')
    return response


# --- PDF TOOL ROUTES ---
@app.route('/api/protect-pdf', methods=['POST', 'OPTIONS'])
def handle_protect_pdf():
    if request.method == 'OPTIONS': return make_response('', 204)
    # ... your protect logic
@app.route('/api/unlock-pdf', methods=['POST', 'OPTIONS'])
def handle_unlock_pdf():
    if request.method == 'OPTIONS': return make_response('', 204)
    # ... your unlock logic

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)
