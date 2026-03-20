# Rama — Regional Voice Assistant (Australia) 🇦🇺🎙️

Rama is a high-performance, multilingual voice assistant designed specifically for migrants and tourists in Australia. It provides real-time information on transport, emergency services, local attractions, and more, using the Web Speech API and Groq's high-speed Llama 3 AI.

## 🚀 Live Demo

**[👉 CLICK HERE TO TALK TO RAMA](https://rama-voice-bot.vercel.app)**

### 🌟 Why Rama?
- **Zero-Install**: Works directly in your browser (Google Chrome).
- **No API Key Needed**: AI intelligence is handled securely on our servers.
- **14 Supported Languages**: Including English, Mandarin, Arabic, Hindi, Spanish, and more.
- **Real-time Translation**: Automatically detects and translates your speech.

## 🏛️ Project Architecture

This project follows a modern **Client-Server Architecture**:

1.  **Frontend (Vanilla JS Modules)**: High-performance, modular ES6 code for Speech and UI logic.
2.  **Backend (Python/Flask)**: A secure gateway to the Groq API, protecting credentials and managing AI context.
3.  **API Layer (Groq)**: Uses the cutting-edge **Llama 3.3 70B** model for lightning-fast regional intelligence.

---

## 🛠️ Developer Setup (Local Development)

The following steps are only required if you wish to run Rama on your local machine or contribute to the project.

### Prerequisites
- Python 3.8+
- A Groq API Key ([Get one here](https://console.groq.com))

### Local Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/radhika-verma06/Rama-VoiceBot.git
    cd Rama-VoiceBot
    ```
2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory:
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```
4.  **Start the Server**:
    ```bash
    python app.py
    ```
5.  **Access the App**:
    Open `http://localhost:5001` in **Google Chrome**.

### ☁️ Deployment (Vercel)
This project is optimized for **Vercel Serverless Functions**. To deploy your own version:
1. Run `vercel` in the root directory.
2. Add `GROQ_API_KEY` to your Vercel environment variables.
3. Run `vercel --prod`.

---

## 📂 Project Structure
```text
.
├── app.py              # Flask Backend & AI Proxy
├── requirements.txt     # Python Dependencies
├── vercel.json         # Serverless Configuration
├── src/                # Frontend Source
│   ├── index.html      # Main Entry Point
│   └── assets/
│       ├── css/        # Styling modules
│       └── js/         # Modular Logic (UI, Speech, API)
└── legacy/             # Original prototype backup
```

## 🛡️ License
Distributed under the MIT License.

## 🤝 Contact
[Radhika Verma](https://github.com/radhika-verma06)
Project Link: [https://github.com/radhika-verma06/Rama-VoiceBot](https://github.com/radhika-verma06/Rama-VoiceBot)
