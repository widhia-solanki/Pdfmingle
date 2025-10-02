# backend/worker.py

from flask import Flask, request, jsonify
from google.cloud import storage, firestore # Import firestore
import subprocess
import os
import uuid
from datetime import datetime, timezone # Import datetime

app = Flask(__name__)
storage_client = storage.Client()
db = firestore.Client() # Initialize Firestore client

@app.route('/', methods=['POST'])
def process_task():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    bucket_name = data.get('bucket')
    input_filename = data.get('filename')
    tool_type = data.get('tool')
    user_id = data.get('userId') # Get the user ID from the request

    if not all([bucket_name, input_filename, tool_type, user_id]):
        return jsonify({"error": "Missing required parameters"}), 400

    # ... (the rest of the file processing logic is the same)

    try:
        # ... (Download from GCS, run subprocess, etc.)

        # 3. Upload the processed file back to GCS
        output_blob_path = f"results/{output_filename}"
        output_blob = bucket.blob(output_blob_path)
        output_blob.upload_from_filename(output_filepath)
        
        # --- THIS IS THE NEW LOGIC ---
        # 4. Save the job details to the user's history in Firestore
        if user_id != 'anonymous': # Don't save history for anonymous users
            history_ref = db.collection('users').document(user_id).collection('history').document()
            history_ref.set({
                'tool': tool_type,
                'originalFilename': input_filename,
                'outputFilename': output_filename,
                'gcsPath': output_blob_path,
                'timestamp': firestore.SERVER_TIMESTAMP
            })

        # 5. Return the path to the new file
        return jsonify({"outputFilename": output_blob_path}), 200

    except Exception as e:
        # ... (error handling)
    finally:
        # ... (cleanup)
