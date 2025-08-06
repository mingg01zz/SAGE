from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

RASA_API_URL = "http://localhost:5005/webhooks/rest/webhook"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    payload = {"sender": "user", "message": user_message}
    try:
        response = requests.post(RASA_API_URL, json=payload)
        data = response.json()
        bot_message = "\n".join([d.get("text", "") for d in data if "text" in d])
    except Exception as e:
        bot_message = f"Error: {str(e)}"
    return jsonify({"bot_message": bot_message})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
