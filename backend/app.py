import os

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

allowed_origins = [
    "http://localhost:3000",
    "https://mingle.vercel.app",
    "https://pdfmingle.net",
    "https://pdfmmingle.net",
]

frontend_url = os.environ.get("FRONTEND_URL")
if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
MAX_TEXT_LENGTH = 20000
MAX_QUESTION_LENGTH = 1000


def normalize_message_content(content):
    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, dict):
                text = item.get("text")
                if isinstance(text, str):
                    parts.append(text)
        return "\n".join(parts).strip()

    return ""


@app.route("/", methods=["GET"])
def healthcheck():
    return jsonify({"status": "ok"}), 200


@app.route("/api/ask-pdf", methods=["POST"])
def ask_pdf():
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        return jsonify({"error": "DeepSeek API key is not configured."}), 500

    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    question = data.get("question", "")

    if not isinstance(text, str) or not isinstance(question, str):
        return jsonify({"error": "Text and question are required."}), 400

    normalized_text = text.strip()[:MAX_TEXT_LENGTH]
    normalized_question = question.strip()[:MAX_QUESTION_LENGTH]

    if not normalized_text or not normalized_question:
        return jsonify({"error": "Text and question cannot be empty."}), 400

    try:
        deepseek_response = requests.post(
            DEEPSEEK_API_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "deepseek-chat",
                "temperature": 0.2,
                "max_tokens": 700,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an AI assistant that answers questions based on provided document text.",
                    },
                    {
                        "role": "user",
                        "content": f'Document text:\n"""\n{normalized_text}\n"""\n\nQuestion: {normalized_question}',
                    },
                ],
            },
            timeout=45,
        )
        payload = deepseek_response.json()
    except requests.RequestException as exc:
        return jsonify({"error": f"DeepSeek request failed: {exc}"}), 502
    except ValueError:
        return jsonify({"error": "DeepSeek returned an invalid response."}), 502

    if not deepseek_response.ok:
        error_message = "DeepSeek request failed."
        if isinstance(payload, dict):
            error = payload.get("error")
            if isinstance(error, dict):
                maybe_message = error.get("message")
                if isinstance(maybe_message, str):
                    error_message = maybe_message
        return jsonify({"error": error_message}), deepseek_response.status_code

    choices = payload.get("choices") if isinstance(payload, dict) else None
    first_choice = choices[0] if isinstance(choices, list) and choices else {}
    message = first_choice.get("message") if isinstance(first_choice, dict) else {}
    content = message.get("content") if isinstance(message, dict) else ""
    answer = normalize_message_content(content)

    if not answer:
        return jsonify({"error": "DeepSeek returned an empty response."}), 502

    return jsonify({"answer": answer}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)), debug=True)
