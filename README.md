<div align="center">

# 🎙️ Rama — Multilingual Regional Voice Assistant for Australia

**An AI-powered voice assistant that speaks 14 languages, designed to help migrants and tourists navigate Australia in real time.**

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-Try_It_Now-00e8b0?style=for-the-badge&logo=vercel&logoColor=white)](https://rama-voice-bot.vercel.app)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=flat&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-Web_Framework-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-FF6B00?style=flat&logo=groq&logoColor=white)](https://groq.com)
[![Vercel](https://img.shields.io/badge/Deployed_On-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat)](LICENSE)

---

**Try saying:** *"Hi Rama, what's the emergency number?"* or *"Hi Rama, how do I get around Sydney?"*

*Works best in Google Chrome · No installation required · Zero data stored*

</div>

---

## 🎯 What Is This?

Rama is a **real-time multilingual voice assistant** built for Australia's diverse migrant and tourist community. It combines:

- **AI-powered conversations** via Groq's Llama 3.3 70B model
- **Real-time speech recognition** in 14 languages
- **Automatic translation detection** — speak in Hindi, get a response in English (or vice versa)
- **Zero-install design** — works directly in the browser

> *"The first voice assistant built specifically for Australia's multicultural communities."*

---

## ✨ Key Features

### 🧠 AI Engine with Triple Resilience
```
┌─────────────────────────────────────────────────────┐
│  🟢 Rama Cloud     → Server-side Groq key (free)   │
│  🔵 Custom API Key  → User's own key (localStorage) │
│  🟡 Offline Mode    → Rule-based fallback engine    │
└─────────────────────────────────────────────────────┘
```
If the cloud hits rate limits, Rama **automatically degrades gracefully** — no crashes, no errors, just smart fallback responses.

### 🌏 14 Languages Supported
| Language | Flag | Language | Flag |
|----------|------|----------|------|
| English | 🇦🇺 | Korean | 🇰🇷 |
| Mandarin | 🇨🇳 | French | 🇫🇷 |
| Arabic | 🇸🇦 | German | 🇩🇪 |
| Hindi | 🇮🇳 | Portuguese | 🇧🇷 |
| Vietnamese | 🇻🇳 | Japanese | 🇯🇵 |
| Italian | 🇮🇹 | Greek | 🇬🇷 |
| Spanish | 🇪🇸 | Filipino | 🇵🇭 |

### 🔄 Real-Time Translation
Speak in your native language → Rama detects it → translates → responds in your chosen language. All in one turn.

### 🎤 Voice-First Design
- Web Speech API for recognition
- SpeechSynthesis for responses
- Real-time waveform visualization
- Wake word detection ("Hi Rama")

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                      │
│                                                           │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌───────────┐  │
│  │ Speech  │  │    UI    │  │   API   │  │  Config   │  │
│  │ Manager │  │ Renderer │  │ Client  │  │  & Langs  │  │
│  └────┬────┘  └────┬─────┘  └────┬────┘  └───────────┘  │
│       │            │             │                        │
│       └────────────┴─────────────┘                        │
│                    │ ES6 Modules                          │
└────────────────────┼─────────────────────────────────────┘
                     │ /api/chat (POST)
┌────────────────────┼─────────────────────────────────────┐
│                    ▼ SERVER (Vercel Serverless)            │
│                                                           │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Flask Backend (app.py)                          │    │
│  │  • CORS handling                                 │    │
│  │  • Custom header API key injection               │    │
│  │  • Translation metadata parsing                  │    │
│  └──────────────┬───────────────────────────────────┘    │
│                  │                                        │
│  ┌──────────────▼───────────────────────────────────┐    │
│  │  Groq API (Llama 3.3 70B Versatile)             │    │
│  │  • System prompt with translation instructions   │    │
│  │  • Context-aware conversation history            │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 How to Use

### Live Demo
1. **Open** [rama-voice-bot.vercel.app](https://rama-voice-bot.vercel.app) in **Google Chrome**
2. **Click** "Enable Microphone"
3. **Say** "Hi Rama" to wake up the assistant
4. **Ask** anything about Australia — transport, food, emergencies, attractions
5. **Switch languages** using the language grid

### Try These Questions
| Question | What Rama Does |
|----------|----------------|
| "Hi Rama, what's the emergency number?" | Returns 000 with context |
| "How do I get around Sydney?" | Explains Opal card system |
| "Where can I find good food?" | Suggests multicultural dining |
| "What are the top attractions?" | Lists landmarks by city |
| "Hi Rama, 我需要帮助" | Detects Mandarin, translates, responds |

### Local Development
```bash
git clone https://github.com/radhika-verma06/Rama-VoiceBot.git
cd Rama-VoiceBot
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_key_here" > .env

# Start server
python app.py

# Open http://localhost:5001 in Chrome
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **AI Model** | Llama 3.3 70B (Groq) | Fastest inference, free tier available |
| **Backend** | Python Flask | Lightweight, serverless-friendly |
| **Frontend** | Vanilla JS (ES6 Modules) | Zero dependencies, fast load |
| **Speech** | Web Speech API | Native browser, no plugins |
| **Hosting** | Vercel | Free, instant deploys, edge functions |
| **Auth** | Custom header injection | Secure API key handling without exposure |

---

## 📂 Project Structure

```
Rama-VoiceBot/
├── app.py                  # Flask backend & Groq API proxy
├── requirements.txt        # Python dependencies
├── vercel.json             # Serverless deployment config
├── .env.example            # Environment template
└── src/
    ├── index.html          # Main entry point
    └── assets/
        ├── css/
        │   └── styles.css  # Full styling (responsive)
        └── js/
            ├── app.js      # Main controller & wake word logic
            ├── api.js      # Backend API communication
            ├── config.js   # Language configs & fallback responses
            ├── speech.js   # Web Speech API wrapper
            └── ui.js       # DOM manipulation & waveform
```

---

## 🧠 Engineering Decisions

### Why Vanilla JS over React?
For a voice-first app, **bundle size matters**. Vanilla JS loads instantly — no framework overhead. The modular ES6 structure gives the same code organization benefits.

### Why Groq over OpenAI?
Groq offers **free API access** with Llama 3.3 70B — a 70B parameter model running at near-instant speeds. Perfect for real-time voice conversations where latency kills the experience.

### Why Flask over FastAPI?
Flask's simplicity meant faster iteration on the serverless proxy layer. The backend is thin by design — just API key injection and response parsing.

### Why the Triple Fallback?
Real-world reliability matters. If Groq's free tier hits rate limits, the app doesn't break — it degrades gracefully to offline responses. This is the kind of resilience pattern that production systems need.

---

## 📊 What I Built (Impact)

- **14 languages** with real-time translation detection
- **Zero-cost operation** using Groq's free tier + Vercel free hosting
- **Sub-second response times** via Groq's optimized inference
- **Privacy-first** — no user data stored, API keys stay in browser localStorage
- **Resilience architecture** — works even when cloud APIs are unavailable

---

## 📜 License

MIT License — use it, learn from it, build on it.

---

## 👤 Built By

**[Radhika Verma](https://github.com/radhika-verma06)** — AI/ML Engineer

*Built to solve a real problem: helping Australia's multicultural communities access information in their own language.*

---

<div align="center">

**[→ Try Rama Live](https://rama-voice-bot.vercel.app)** · **[View Source](https://github.com/radhika-verma06/Rama-VoiceBot)**

</div>
