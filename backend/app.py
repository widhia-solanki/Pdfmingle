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
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

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

    if not auth_code:
        return jsonify({"error": "Authorization code is missing"}), 400
        
    try:
        # NOTE: You MUST download your client_secret.json from Google Cloud Console
        # and place it in the same directory as this app.py file.
        client_secrets_path = os.path.join(os.path.dirname(__file__), 'client_secret.json')

        flow = Flow.from_client_secrets_file(
            client_secrets_path,
            scopes=[
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'openid'
            ],
            redirect_uri='postmessage'
        )

        flow.fetch_token(code=auth_code)
        credentials = flow.credentials
        
        # id_token is a JWT containing user profile info
        id_info = jwt.decode(credentials.id_token, options={"verify_signature": False})
        
        email = id_info.get('email').lower()
        
        user_query = users_collection.where('email', '==', email).limit(1).get()
        user_list = list(user_query)
        
        if len(user_list) > 0:
            user_doc = user_list[0]
        else:
            user_data = {
                'email': email,
                'name': id_info.get('name'),
                'provider': 'google',
                'createdAt': firestore.SERVER_TIMESTAMP
            }
            _, user_doc_ref = users_collection.add(user_data)
            user_doc = user_doc_ref.get()

        return create_session(user_doc)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An unexpected server error occurred during Google authentication."}), 500


# --- EXISTING AUTH ROUTES ---

@app.route('/api/signup', methods=['POST'])
def handle_signup():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'): return jsonify({"error": "Email and password are required"}), 400
    email = data.get('email').lower()
    password = data.get('password')
    existing_user = users_collection.where('email', '==', email).limit(1).get()
    if len(list(existing_user)) > 0: return jsonify({"error": "An account with this email already exists"}), 409
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user_data = {'email': email, 'password': hashed_password, 'provider': 'email', 'createdAt': firestore.SERVER_TIMESTAMP}
    users_collection.add(user_data)
    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def handle_login():
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
    response = make_response(jsonify({"message": "Logout successful"}), 200)
    response.set_cookie('auth_token', '', expires=0, httponly=True, secure=True, samesite='Lax')
    return response


# --- EXISTING PDF TOOL ROUTES ---

@app.route('/api/protect-pdf', methods=['POST'])
def handle_protect_pdf():
    if 'file' not in request.files: return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    password = request.form.get('password')
    if not file or not file.filename: return jsonify({"error": "No selected file"}), 400
    if not password: return jsonify({"error": "Password is required"}), 400
    try:
        pdf_stream = io.BytesIO(file.read())
        reader = PdfReader(pdf_stream)
        writer = PdfWriter()
        for page in reader.pages: writer.add_page(page)
        writer.encrypt(password)
        encrypted_stream = io.BytesIO()
        writer.write(encrypted_stream)
        encrypted_stream.seek(0)
        return send_file(encrypted_stream, as_attachment=True, download_name=f"protected_{file.filename}", mimetype='application/pdf')
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "Failed to protect the PDF."}), 500

@app.route('/api/unlock-pdf', methods=['POST'])
def handle_unlock_pdf():
    if 'file' not in request.files: return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    password = request.form.get('password')
    if not file or not file.filename: return jsonify({"error": "No selected file"}), 400
    if password is None: return jsonify({"error": "Password must be provided"}), 400
    temp_dir = f"/tmp/{uuid.uuid4()}"
    os.makedirs(temp_dir, exist_ok=True)
    input_path = os.path.join(temp_dir, file.filename)
    output_path = os.path.join(temp_dir, f"unlocked_{file.filename}")
    try:
        file.save(input_path)
        command = ['qpdf', '--password=' + password, '--decrypt', input_path, output_path]
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode != 0:
            if 'invalid password' in result.stderr.lower():
                return jsonify({"error": "Incorrect password."}), 403
            else:
                print(f"qpdf error: {result.stderr.strip()}")
                return jsonify({"error": f"Failed to process the PDF. It may be corrupted or unsupported."}), 500
        return send_file(output_path, as_attachment=True, download_name=f"unlocked_{file.filename}", mimetype='application/pdf')
    except Exception:
        traceback.print_exc()
        return jsonify({"error": "An unexpected server error occurred."}), 500
    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)
