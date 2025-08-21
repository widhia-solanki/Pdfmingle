from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for your entire app.
# This tells the server to accept requests from any website.
# For production, you might want to restrict this to just your Vercel URL.
CORS(app)

# This route is useful for checking if the server is running
@app.route('/', methods=['GET'])
def index():
    return "PDFMingle Backend is running!"

if __name__ == '__main__':
    app.run(debug=True, port=5001)
