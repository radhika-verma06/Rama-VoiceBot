# Rama — Regional Voice Assistant (Australia) 🇦🇺🎙️

Rama is a high-performance, multilingual voice assistant designed specifically for migrants and tourists in Australia. It provides real-time information on transport, emergency services, local attractions, and more, using the Web Speech API and Anthropic's Claude AI.

![Rama UI Mockup](https://via.placeholder.com/800x450.png?text=Rama+Voice+Assistant+UI+Mockup)

## 🌟 Features

- **14 Supported Languages**: Including English, Mandarin, Arabic, Hindi, Spanish, and more.
- **Voice-First Experience**: Fully interactive with wake-word detection ("Hi Rama") and text-to-speech feedback.
- **AI-Powered Intelligence**: Integrated with Claude AI for nuanced, context-aware conversations.
- **Real-time Translation**: Automatically detects input language and translates it to your selected target language.
- **Professional Architecture**: Split into modular components with a secure Flask backend proxy.

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3 (Glassmorphism), ES6 modules.
- **APIs**: Web Speech API (Recognition/Synthesis).
- **Backend**: Python 3.x, Flask.
- **AI**: Anthropic Claude 3 Sonnet.

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- An Anthropic API Key ([Get one here](https://console.anthropic.com))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/rama-voicebot.git
   cd rama-voicebot
   ```

2. **Set up a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_sk_ant_api_key_here
   ```

5. **Run the application**:
   ```bash
   python app.py
   ```
   Open `http://localhost:5000` in **Google Chrome** (required for Web Speech API).

### Deploying to Vercel (Recommended)

Vercel is the easiest way to deploy this project as a serverless application.

1.  **Install Vercel CLI**: `npm i -g vercel`
2.  **Deploy**: Run `vercel` in the root directory.
3.  **Add Environment Variable**: In the Vercel dashboard, go to Settings > Environment Variables and add `ANTHROPIC_API_KEY`.
4.  **Production**: Run `vercel --prod` for the final deployment.

### Deploying to Render/Railway

## 📂 Project Structure

```text
.
├── app.py              # Flask Backend & API Proxy
├── requirements.txt     # Python Dependencies
├── .env.example        # Configuration Template
├── src/                # Frontend Source
│   ├── index.html      # Main Entry Point
│   └── assets/
│       ├── css/        # Styling modules
│       └── js/         # Modular Logic (UI, Speech, API)
├── docs/               # Project Documentation
├── tests/              # Test suites
└── legacy/             # Original prototype backup
```

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

## 🤝 Contact

Your Name - [GitHub](https://github.com/your-username)
Project Link: [https://github.com/your-username/rama-voicebot](https://github.com/your-username/rama-voicebot)
