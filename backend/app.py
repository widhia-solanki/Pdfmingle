# backend/app.py

from flask import Flask, request, send_file, jsonify, make_response
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from PyPDF2 import PdfReader, PdfWriter
import jwt
from google.cloud import firestore
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
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- Firestore Client ---
# The client will automatically use the GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable
db = firestore.Client()
users_collection = db.collection('users')

# --- JWT Configuration ---
# Make sure to set this in your environment variables
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
if not JWT_SECRET_KEY:
    raise ValueError("No JWT_SECRET_KEY set for Flask application")


# --- NEW AUTHENTICATION ROUTES ---

@app.route('/api/signup', methods=['POST'])
def handle_signup():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    email = data.get('email').lower()
    password = data.get('password')

    # Check if user already exists
    existing_user = users_collection.where('email', '==', email).limit(1).get()
    if len(list(existing_user)) > 0:
        return jsonify({"error": "An account with this email already exists"}), 409

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Create new user in Firestore
    user_data = {
        'email': email,
        'password': hashed_password,
        'createdAt': firestore.SERVER_TIMESTAMP
    }
    users_collection.add(user_data)

    return jsonify({"message": "User created successfully"}), 201


@app.route('/api/login', methods=['POST'])
def handle_login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400

    email = data.get('email').lower()
    password = data.get('password')

    # Find user in Firestore
    user_query = users_collection.where('email', '==', email).limit(1).get()
    user_list = list(user_query)
    if len(user_list) == 0:
        return jsonify({"error": "Invalid credentials"}), 401

    user_doc = user_list[0]
    user_data = user_doc.to_dict()

    # Check password
    if not bcrypt.check_password_hash(user_data.get('password'), password):
        return jsonify({"error": "Invalid credentials"}), 401

    # Create JWT
    payload = {
        'sub': user_doc.id,  # Subject (user ID)
        'iat': datetime.now(timezone.utc),  # Issued At
        'exp': datetime.now(timezone.utc) + timedelta(days=7)  # Expiration
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')

    # Set JWT in an HTTPOnly cookie
    response = make_response(jsonify({"message": "Login successful", "user": {"email": email}}), 200)
    response.set_cookie(
        'auth_token', 
        token, 
        httponly=True, 
        secure=True, # Use True in production with HTTPS
        samesite='Lax', 
        max_age=timedelta(days=7)
    )
    return response


@app.route('/api/user', methods=['GET'])
def get_current_user():
    token = request.cookies.get('auth_token')
    if not token:
        return jsonify({"error": "Not authenticated"}), 401

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        user_id = payload['sub']
        
        user_doc = users_collection.document(user_id).get()
        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 401

        user_data = user_doc.to_dict()
        return jsonify({"user": {"email": user_data.get('email')}}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401


@app.route('/api/logout', methods=['POST'])
def handle_logout():
    response = make_response(jsonify({"message": "Logout successful"}), 200)
    response.set_cookie('auth_token', '', expires=0) # Expire the cookie
    return response


# --- EXISTING PDF TOOL ROUTES ---

@app.route('/api/protect-pdf', methods=['POST'])
def handle_protect_pdf():
    # ... (this function remains the same)
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
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Failed to protect the PDF."}), 500


@app.route('/api/unlock-pdf', methods=['POST'])
def handle_unlock_pdf():
    # ... (this function remains the same)
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
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "An unexpected server error occurred."}), 500
    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)), debug=True)
