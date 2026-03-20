import os
import re
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='src')
CORS(app)

# Groq Client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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
    if not os.getenv("GROQ_API_KEY"):
        return jsonify({"error": "GROQ_API_KEY not configured on server"}), 500

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

        If the user already writes in {lang_name}, skip the detection block and just respond normally.
        
        Always prioritize local Australian knowledge (000 emergency, Opal/Myki cards, etc.)."""

        # Prepare messages for Groq (Llama 3 format)
        messages = [{"role": "system", "content": system_prompt}]
        for msg in context:
            messages.append(msg)
        messages.append({"role": "user", "content": user_text})

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=400,
            top_p=1,
            stream=False,
            stop=None,
        )
        
        raw_text = completion.choices[0].message.content
        
        # Parse translation blocks
        detected_lang = None
        translation = None
        
        detected_match = re.search(r'\[DETECTED:\s*([^\]]+)\]', raw_text, re.IGNORECASE)
        translated_match = re.search(r'\[TRANSLATED:\s*([^\]]+)\]', raw_text, re.IGNORECASE)
        
        if detected_match:
            detected_lang = detected_match.group(1).strip()
        if translated_match:
            translation = translated_match.group(1).strip()
            
        # Clean reply (remove metadata blocks)
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
