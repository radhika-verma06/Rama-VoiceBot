# Contributing to Rama

Thanks for your interest in contributing! Here's how to get started.

## Quick Start

```bash
git clone https://github.com/radhika-verma06/Rama-VoiceBot.git
cd Rama-VoiceBot
pip install -r requirements.txt
cp .env.example .env  # Add your Groq API key
python app.py
# Open http://localhost:5001
```

## Project Structure

- `app.py` — Flask backend (API proxy to Groq)
- `src/assets/js/` — Frontend modules (ES6)
- `src/assets/css/` — Styling
- `vercel.json` — Deployment config

## Development Guidelines

1. **Keep it lightweight** — No framework dependencies on the frontend
2. **Test voice features** in Google Chrome (Web Speech API requirement)
3. **Maintain fallback logic** — The offline mode should always work
4. **Follow the existing code style** — ES6 modules, no build step

## Adding a Language

1. Add the language to `LANGS` array in `src/assets/js/config.js`
2. Add fallback responses in `RESP` object
3. Add wake word patterns in `src/assets/js/app.js` (`isWakeWord` function)

## Reporting Issues

Open an issue on GitHub with:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
