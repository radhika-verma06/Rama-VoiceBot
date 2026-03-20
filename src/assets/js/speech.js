/**
 * Web Speech API wrappers for Recognition and Synthesis.
 */

import { debug, setOrbClass, setWaveMode, setStatus, $ } from './ui.js';

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

export class SpeechManager {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.micEnabled = false;
    this.micStream = null;
    this.audioCtx = null;
    this.analyser = null;
    this.freqData = null;
  }

  async enableMic() {
    if (this.micEnabled) return true;
    if (!navigator.mediaDevices?.getUserMedia) {
      debug('Microphone API not supported');
      setStatus('Mic unsupported', 'Use a modern Chrome-based browser');
      return false;
    }
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.micEnabled = true;
      localStorage.setItem('ramaMicEnabled', '1');
      $('cMic').textContent = 'MIC: ON';
      $('cMic').classList.add('on');
      $('btnMic').disabled = true;
      $('btnMic').textContent = 'Microphone Enabled';
      $('btnL').disabled = false;

      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
      this.audioCtx.createMediaStreamSource(this.micStream).connect(this.analyser);

      setStatus('Mic enabled!', 'Click <strong style="color:var(--teal)">▶ Listen</strong> and say "Hi Rama"');
      return true;
    } catch (e) {
      console.error('Mic error:', e);
      localStorage.removeItem('ramaMicEnabled');
      debug('Mic blocked — allow in settings');
      setStatus('Mic blocked', 'Allow microphone in browser settings');
      return false;
    }
  }

  stopRecognition() {
    this.isListening = false;
    if (this.recognition) {
      this.recognition.onstart = null;
      this.recognition.onend = null;
      this.recognition.onerror = null;
      this.recognition.onresult = null;
      try { this.recognition.stop(); } catch (e) {}
      this.recognition = null;
    }
  }

  startRecognition(langCode, callbacks) {
    if (!this.micEnabled || !SR) return;
    if (this.isListening) return;
    if (this.isSpeaking) {
      setTimeout(() => this.startRecognition(langCode, callbacks), 200);
      return;
    }
    this.stopRecognition();

    this.recognition = new SR();
    this.recognition.lang = langCode;
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.isListening = true;

    this.recognition.onstart = () => {
      $('btnL').disabled = true;
      $('btnS').disabled = false;
      setOrbClass('L');
      setWaveMode('listening');
      setStatus('Listening...', 'Speak now');
      debug('Listening...');
      if (callbacks.onStart) callbacks.onStart();
    };

    this.recognition.onresult = (event) => {
      let interim = '', final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript;
        else interim += transcript;
      }
      $('liveTr').textContent = (final || interim || '—').trim();

      if (final.trim() && callbacks.onFinalResult) {
        callbacks.onFinalResult(final.trim());
      }
    };

    this.recognition.onerror = (e) => {
      this.isListening = false;
      if (e.error === 'aborted') return;
      if (e.error === 'no-speech') {
        if (callbacks.shouldRestart && callbacks.shouldRestart()) {
          setTimeout(() => this.startRecognition(langCode, callbacks), 300);
        } else {
          $('btnL').disabled = false;
          $('btnS').disabled = true;
          setOrbClass('');
          setWaveMode('idle');
        }
        return;
      }
      debug('Mic error: ' + e.error);
      $('btnL').disabled = false;
      $('btnS').disabled = true;
      setOrbClass('');
      setWaveMode('idle');
      setStatus('Error', 'Click Listen to try again');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      $('btnL').disabled = false;
      $('btnS').disabled = true;
      if (callbacks.shouldRestart && callbacks.shouldRestart()) {
        setTimeout(() => this.startRecognition(langCode, callbacks), 300);
      } else if (!this.isSpeaking) {
        setOrbClass('');
        setWaveMode('idle');
      }
      if (callbacks.onEnd) callbacks.onEnd();
    };

    try { this.recognition.start(); }
    catch (e) { this.isListening = false; debug('Could not start mic: ' + e.message); }
  }

  speak(text, langCode, onEnd) {
    if (this.isSpeaking) speechSynthesis.cancel();
    this.isSpeaking = true;

    const clean = text.normalize('NFC')
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
      .replace(/[\u{2600}-\u{27BF}]/gu, '')
      .replace(/[*_#`]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!clean) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      return;
    }

    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = langCode;

    const rates = { 'hi-IN': 0.78, 'ar-SA': 0.80, 'ja-JP': 0.82, 'ko-KR': 0.82, 'zh-CN': 0.82 };
    utt.rate = rates[langCode] || 0.88;
    utt.pitch = 1.0;

    const allVoices = speechSynthesis.getVoices();
    const langPrefix = langCode.split('-')[0];
    let cands = allVoices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));

    const prefersGoogle = ['hi-IN', 'ar-SA', 'vi-VN', 'ko-KR', 'ja-JP', 'zh-CN'];
    let chosen;
    if (prefersGoogle.includes(langCode)) {
      chosen = cands.find(v => v.name.toLowerCase().includes('google')) || cands[0];
    } else {
      chosen = cands.find(v => v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('karen') || v.name.toLowerCase().includes('female')) || cands[0];
    }

    if (chosen) utt.voice = chosen;

    utt.onstart = () => {
      setOrbClass('S');
      setWaveMode('speaking');
    };
    utt.onend = () => {
      this.isSpeaking = false;
      setOrbClass('');
      setWaveMode('idle');
      if (onEnd) onEnd();
    };
    utt.onerror = (e) => {
      console.warn('TTS error:', e);
      this.isSpeaking = false;
      setOrbClass('');
      setWaveMode('idle');
      if (onEnd) onEnd();
    };

    speechSynthesis.speak(utt);
  }
}
