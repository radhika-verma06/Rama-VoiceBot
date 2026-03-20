import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from anthropic import Anthropic
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='src')
CORS(app)

# Anthropic Client
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_text = data.get('text')
    context = data.get('context', [])
    lang_name = data.get('langName', 'English')
    
    # Check if API key is configured
    if not os.getenv("ANTHROPIC_API_KEY"):
        return jsonify({"error": "API Key not configured on server"}), 500

    try:
        # System prompt with TRANSLATION instructions
        system_prompt = f"""You are Rama, a friendly Australia regional assistant for migrants and tourists. 
        You must respond in {lang_name} language ONLY.
        Be warm and brief (2-3 sentences max, suitable for voice).

        IMPORTANT - TRANSLATION DETECTION:
        If the user writes in a DIFFERENT language than {lang_name}, you MUST:
        1. Start your response with this exact format:
        [DETECTED: language_name]
        [TRANSLATED: translation of user message into {lang_name}]
        2. Then provide your helpful response in {lang_name}.

        If the user already writes in {lang_name}, skip the detection block and just respond normally."""

        response = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=400,
            system=system_prompt,
            messages=context + [{"role": "user", "content": user_text}]
        )
        
        raw_text = response.content[0].text
        
        # Parse translation blocks
        detected_lang = None
        translation = None
        reply = raw_text
        
        import re
        detected_match = re.search(r'\[DETECTED:\s*([^\]]+)\]', raw_text, re.IGNORECASE)
        translated_match = re.search(r'\[TRANSLATED:\s*([^\]]+)\]', raw_text, re.IGNORECASE)
        
        if detected_match:
            detected_lang = detected_match.group(1).strip()
        if translated_match:
            translation = translated_match.group(1).strip()
            
        # Clean reply
        reply = re.sub(r'\[DETECTED:[^\]]+\]', '', raw_text, flags=re.IGNORECASE)
        reply = re.sub(r'\[TRANSLATED:[^\]]+\]', '', reply, flags=re.IGNORECASE).strip()
        
        return jsonify({
            "reply": reply,
            "detectedLang": detected_lang,
            "translation": translation
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
