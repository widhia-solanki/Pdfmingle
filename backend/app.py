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
import uuid
import traceback
import subprocess
import shutil
from datetime import datetime, timedelta, timezone

# --- App Initialization ---
app = Flask(__name__)
bcrypt = Bcrypt(app)

# --- THIS IS THE FIX ---
# A more robust CORS configuration that allows credentials and specific headers.
CORS(
    app,
    resources={r"/api/*": {"origins": ["https://pdfmingle.net", "http://localhost:3000"]}},
    supports_credentials=True
)

# --- Environment Variable Checks ---
if not os.environ.get('JWT_SECRET_KEY'):
    raise ValueError("No JWT_SECRET_KEY set for Flask application")

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


# --- GOOGLE AUTH ROUTE ---
@app.route('/api/auth/google', methods=['POST'])
def handle_google_auth():
    data = request.get_json()
    auth_code = data.get('code')
    if not auth_code: return jsonify({"error": "Authorization code is missing"}), 400
    try:
        client_secrets_path = os.path.join(os.path.dirname(__file__), 'client_secret.json')
        flow = Flow.from_client_secrets_file(
            client_secrets_path,
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/drive.file'],
            redirect_uri='postmessage'
        )
        flow.fetch_token(code=auth_code)
        credentials = flow.credentials
        id_info = jwt.decode(credentials.id_token, options={"verify_signature": False})
        email = id_info.get('email').lower()
        user_query = users_collection.where('email', '==', email).limit(1).get()
        user_list = list(user_query)
        if len(user_list) > 0:
            user_doc = user_list[0]
        else:
            user_data = {'email': email, 'name': id_info.get('name'), 'provider': 'google', 'createdAt': firestore.SERVER_TIMESTAMP}
            _, user_doc_ref = users_collection.add(user_data)
            user_doc = user_doc_ref.get()
        return create_session(user_doc)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An unexpected server error occurred during Google authentication."}), 500


# --- ALL OTHER ROUTES (UNCHANGED) ---
@app.route('/api/signup', methods=['POST'])
def handle_signup():
    # ... code ...
@app.route('/api/login', methods=['POST'])
def handle_login():
    # ... code ...
@app.route('/api/user', methods=['GET'])
def get_current_user():
    # ... code ...
@app.route('/api/logout', methods=['POST'])
def handle_logout():
    # ... code ...
@app.route('/api/protect-pdf', methods=['POST'])
def handle_protect_pdf():
    # ... code ...
@app.route('/api/unlock-pdf', methods=['POST'])
def handle_unlock_pdf():
    # ... code ...


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)
