# backend/app.py

from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import jwt
from google.cloud import firestore
from google_auth_oauthlib.flow import Flow
import os
import json
from datetime import datetime, timezone, timedelta
from functools import wraps
# ... other imports remain the same

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, origins=["https://pdfmingle.net", "http://localhost:3000"], supports_credentials=True)

JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
db = firestore.Client()
users_collection = db.collection('users')

# --- NEW: JWT DECORATOR FOR PROTECTED ROUTES ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('auth_token')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
            current_user_doc = users_collection.document(data['sub']).get()
            if not current_user_doc.exists:
                return jsonify({'error': 'User not found'}), 401
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return jsonify({'error': 'Token is invalid or expired'}), 401
        return f(current_user_doc, *args, **kwargs)
    return decorated

# --- NEW: ACCOUNT MANAGEMENT ENDPOINTS ---

@app.route('/api/account/profile', methods=['PUT'])
@token_required
def update_profile(current_user_doc):
    data = request.get_json()
    new_name = data.get('name')
    if not new_name:
        return jsonify({'error': 'Name is required'}), 400
    
    try:
        users_collection.document(current_user_doc.id).update({'name': new_name})
        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/account/settings', methods=['GET', 'POST'])
@token_required
def manage_settings(current_user_doc):
    settings_ref = users_collection.document(current_user_doc.id).collection('settings').document('preferences')
    
    if request.method == 'GET':
        settings_doc = settings_ref.get()
        if settings_doc.exists:
            return jsonify(settings_doc.to_dict()), 200
        else:
            # Return default settings if none exist
            return jsonify({'darkMode': True, 'emailNotifications': False}), 200
            
    if request.method == 'POST':
        data = request.get_json()
        settings_data = {
            'darkMode': data.get('darkMode', True),
            'emailNotifications': data.get('emailNotifications', False),
            'updatedAt': firestore.SERVER_TIMESTAMP
        }
        settings_ref.set(settings_data, merge=True)
        return jsonify({'message': 'Settings updated'}), 200

@app.route('/api/account/delete', methods=['DELETE'])
@token_required
def delete_account(current_user_doc):
    try:
