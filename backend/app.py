# backend/app.py

from flask import Flask, request, send_file, jsonify, make_response
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from PyPDF2 import PdfReader, PdfWriter
import jwt
from google.cloud import firestore
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
import os
import io
import uuid
import traceback
import subprocess
import shutil
from datetime import datetime, timedelta, timezone

# --- App Initialization ---
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# --- Environment Variable Checks ---
if not os.environ.get('JWT_SECRET_KEY'):
    raise ValueError("No JWT_SECRET_KEY set for Flask application")
if not os.environ.get('GOOGLE_CLIENT_ID'):
    raise ValueError("No GOOGLE_CLIENT_ID set for Flask application")
if not os.environ.get('GOOGLE_CLIENT_SECRET'):
    raise ValueError("No GOOGLE_CLIENT_SECRET set for Flask application")

# --- JWT Configuration ---
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')

# --- Firestore Client ---
db = firestore.Client()
users_collection = db.collection('users')


# --- HELPER FUNCTION TO CREATE SESSION ---
def create_session(user_doc):
    """Creates a JWT and returns a Flask response with the session cookie."""
    payload = {
        'sub': user_doc.id,
        'iat': datetime.now(timezone.utc),
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
    user_data = user_doc.to_dict()

    response = make_response(jsonify({
        "message": "Login successful",
        "user": {"email": user_data.get('email')}
    }), 200)

    response.set_cookie(
        'auth_token', token, httponly=True, secure=True,
        samesite='Lax', max_age=timedelta(days=7)
    )
    return response


# --- NEW GOOGLE AUTH ROUTE ---

@app.route('/api/auth/google', methods=['POST'])
def handle_google_auth():
    data = request.get_json()
    id_token_jwt = data.get('id_token')

    if not id_token_jwt:
        return jsonify({"error": "ID token is missing"}), 400

    try:
        # Verify the ID token with Google
        id_info = id_token.verify_oauth2_token(
            id_token_jwt, Request(), os.environ.get('GOOGLE_CLIENT_ID')
        )

        email = id_info.get('email').lower()
        
        # Check if user already exists
        user_query = users_collection.where('email', '==', email).limit(1).get()
        user_list = list(user_query)
        
        if len(user_list) > 0:
            # User exists, log them in
            user_doc = user_list[0]
        else:
            # User does not exist, create a new account
            user_data = {
                'email': email,
                'name': id_info.get('name'),
                'provider': 'google',
                'createdAt': firestore.SERVER_TIMESTAMP
            }
            # The add() method returns a tuple (timestamp, document_reference)
            _, user_doc_ref = users_collection.add(user_data)
            user_doc = user_doc_ref.get()

        # Create session and return response
        return create_session(user_doc)

    except ValueError as e:
        # Invalid token
        traceback.print_exc()
        return jsonify({"error": "Invalid Google token."}), 401
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An unexpected server error occurred."}), 500


# --- EXISTING AUTH ROUTES ---
@app.route('/api/signup', methods=['POST'])
def handle_signup():
    # ... (this function remains the same)
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'): return jsonify({"error": "Email and password are required"}), 400
    email = data.get('email').lower()
    password = data.get('password')
    existing_user = users_collection.where('email', '==', email).limit(1).get()
    if len(list(existing_user)) > 0: return jsonify({"error": "An account with this email already exists"}), 409
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user_data = {'email': email, 'password': hashed_password, 'createdAt': firestore.SERVER_TIMESTAMP}
    users_collection.add(user_data)
    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def handle_login():
    # ... (this function remains the same)
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'): return jsonify({"error": "Email and password are required"}), 400
    email = data.get('email').lower()
    password = data.get('password')
    user_query = users_collection.where('email', '==', email).limit(1).get()
    user_list = list(user_query)
    if len(user_list) == 0: return jsonify({"error": "Invalid credentials"}), 401
    user_doc = user_list[0]
    user_data = user_doc.to_dict()
    if not user_data.get('password') or not bcrypt.check_password_hash(user_data.get('password'), password):
        return jsonify({"error": "Invalid credentials"}), 401
    return create_session(user_doc)


@app.route('/api/user', methods=['GET'])
def get_current_user():
    # ... (this function remains the same)
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

@app.route('/api/logout', methods=['POST'])
def handle_logout():
    # ... (this function remains the same)
    response = make_response(jsonify({"message": "Logout successful"}), 200)
    response.set_cookie('auth_token', '', expires=0, httponly=True, secure=True, samesite='Lax')
    return response

# --- EXISTING PDF TOOL ROUTES ---
@app.route('/api/protect-pdf', methods=['POST'])
def handle_protect_pdf():
    # ... (unchanged)
    pass

@app.route('/api/unlock-pdf', methods=['POST'])
def handle_unlock_pdf():
    # ... (unchanged)
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)
