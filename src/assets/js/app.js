/**
 * Main Application Controller for Rama Voice Assistant.
 */

import { LANGS, RESP } from './config.js';
import { $, setStatus, setOrbClass, setWaveMode, debug, getTimeString, addChatMessage, showTypingIndicator, hideTypingIndicator, initWaveform, startWaveformAnimation } from './ui.js';
import { SpeechManager } from './speech.js';
import { getAIReply } from './api.js';

let curLang = LANGS[0];
let awake = false;
let turn = 0;
let userName = null;
let conversationHistory = [];

const speech = new SpeechManager();

// ═══════════════════════════════════════════════════════════════
// Initialization
// ═══════════════════════════════════════════════════════════════

function init() {
  // Build language grid
  const grid = $('langGrid');
  LANGS.forEach(l => {
    const b = document.createElement('button');
    b.className = 'lb' + (l.code === 'en-US' ? ' active' : '');
    b.textContent = l.flag + ' ' + l.name;
    b.onclick = () => {
      document.querySelectorAll('.lb').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      curLang = l;
      $('lActive').textContent = l.name;
      $('cLang').textContent = l.name.slice(0, 3).toUpperCase();
      debug('Language: ' + l.name);
      if (speech.isListening) {
        speech.stopRecognition();
        setTimeout(startListening, 400);
      }
    };
    grid.appendChild(b);
  });

  // Init Waveform
  initWaveform('wave');
  
  // Connect Control buttons
  $('btnMic').onclick = () => speech.enableMic().then(ok => {
    if (ok) startWaveformAnimation(speech.analyser, speech.freqData);
  });
  $('btnL').onclick = () => { if (speech.micEnabled) startListening(); else debug('Enable mic first'); };
  $('btnS').onclick = stopEverything;
  $('btnC').onclick = clearChat;
  $('btnExport').onclick = exportChat;
  $('btnSend').onclick = sendText;
  $('ti').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); sendText(); } };
  $('orb').onclick = () => {
    if (!speech.micEnabled) { setStatus('Enable mic first', 'Click Enable Microphone above'); return; }
    if (speech.isListening) { speech.stopRecognition(); setOrbClass(''); setWaveMode('idle'); $('btnL').disabled = false; $('btnS').disabled = true; }
    else startListening();
  };

  // Restore mic if already granted
  restoreMicIfAlreadyGranted();
  
  setStatus('Ready', 'Enable mic, select language, then say "Hi Rama"');
}

async function restoreMicIfAlreadyGranted() {
  if (!('permissions' in navigator) || !localStorage.getItem('ramaMicEnabled')) return;
  try {
    const status = await navigator.permissions.query({ name: 'microphone' });
    if (status.state === 'granted') await speech.enableMic().then(ok => {
      if (ok) startWaveformAnimation(speech.analyser, speech.freqData);
    });
  } catch (e) { console.warn('Permissions API unavailable', e); }
}

// ═══════════════════════════════════════════════════════════════
// Core Logic
// ═══════════════════════════════════════════════════════════════

function startListening() {
  speech.startRecognition(curLang.code, {
    onStart: () => {
      setStatus('Listening...', 'Speak in ' + curLang.name);
    },
    onFinalResult: (text) => {
      debug('Heard: ' + text);
      if (!awake && isWakeWord(text)) handleWake();
      else if (awake) handleInput(text);
      else setStatus('Say "Hi Rama" first', 'Wake me up to start');
    },
    shouldRestart: () => awake && speech.micEnabled && !speech.isSpeaking
  });
}

function stopEverything() {
  awake = false;
  speech.stopRecognition();
  speechSynthesis.cancel();
  speech.isSpeaking = false;
  $('btnS').disabled = true;
  $('btnL').disabled = false;
  setOrbClass('');
  setWaveMode('idle');
  setStatus('Stopped', 'Click Listen to start again');
  debug('Stopped.');
}

async function handleWake() {
  awake = true;
  conversationHistory = [];
  const orb = $('orb');
  orb.classList.add('W');
  setTimeout(() => orb.classList.remove('W'), 600);
  setStatus('Waking up!', 'Rama is greeting you...');
  
  const langConfig = RESP[curLang.code] || RESP['en-US'];
  const greet = langConfig.wake(userName);
  
  conversationHistory.push({ role: 'assistant', content: greet });
  const modeLabel = 'Groq AI';
  addChatMessage(greet, 'b', 'Rama · ' + getTimeString() + ' · ' + modeLabel, curLang.name);
  
  speech.speak(greet, curLang.code, () => {
    setStatus('Listening...', 'Ask me anything!');
    setOrbClass('L');
    setWaveMode('listening');
    setTimeout(startListening, 300);
  });
}

async function handleInput(text) {
  if (!text.trim()) return;
  turn++;
  $('cTurn').textContent = 'TURN: ' + turn;
  
  const name = extractName(text);
  if (name) userName = name;

  if (speech.isListening) speech.stopRecognition();
  setStatus('Thinking...', 'Processing...');
  setOrbClass('');
  
  const userMsgRow = addChatMessage(text, 'u', 'You · ' + getTimeString() + ' · ' + curLang.name, curLang.name);
  
  let reply, detectedLang = null, translation = null;
  
  // Use AI via backend proxy
  showTypingIndicator();
  const aiResult = await getAIReply(text, conversationHistory, curLang.name);
  hideTypingIndicator();

  if (aiResult) {
    reply = aiResult.reply;
    detectedLang = aiResult.detectedLang;
    translation = aiResult.translation;
    
    if (detectedLang && translation) {
      // Add translation pill to user message
      const pill = createTranslationPill(detectedLang, translation, curLang.name);
      userMsgRow.insertBefore(pill, userMsgRow.querySelector('.meta'));
      debug('Translated from ' + detectedLang);
    }
    conversationHistory.push({ role: 'user', content: text });
    conversationHistory.push({ role: 'assistant', content: reply });
  } else {
    // Fallback to rule-based
    const langConfig = RESP[curLang.code] || RESP['en-US'];
    reply = langConfig.think(text);
  }
  
  const modeLabel = 'Groq AI';
  addChatMessage(reply, 'b', 'Rama · ' + getTimeString() + ' · ' + curLang.name + ' · ' + modeLabel, curLang.name);
  
  speech.speak(reply, curLang.code, () => {
    if (awake && speech.micEnabled) {
      setStatus('Listening...', 'Ask me anything!');
      setOrbClass('L');
      setWaveMode('listening');
      setTimeout(startListening, 300);
    }
  });
}

function isWakeWord(text) {
  const t = text.toLowerCase().replace(/[^a-z\s]/g, '').trim();
  return /\b(hi|hey|hello|ok|okay|hai)\s+(rama|ramma|lama|rema|roma)\b/.test(t) || 
         /^(rama|ramma|rema|lama)\s*$/.test(t) ||
         (/rama|ramma|rema/.test(t) && t.split(' ').length <= 4);
}

function extractName(text) {
  const m = text.match(/(?:i(?:'?m| am)|my name is|call me)\s+([A-Za-z]+)/i);
  return m ? m[1] : null;
}

function createTranslationPill(detected, trans, target) {
  const pill = document.createElement('div');
  pill.className = 'trans-pill';
  pill.innerHTML = `<div class="trans-label">🌐 ${detected} → ${target}</div><div class="trans-text">${trans}</div>`;
  return pill;
}

function sendText() {
  const text = $('ti').value.trim();
  if (!text) return;
  $('ti').value = '';
  if (!awake && isWakeWord(text)) handleWake();
  else { if (!awake) awake = true; handleInput(text); }
}

function clearChat() {
  stopEverything();
  conversationHistory = [];
  turn = 0;
  userName = null;
  $('cTurn').textContent = 'TURN: 0';
  $('cSess').textContent = '0 msgs';
  $('log').innerHTML = '<div class="empty" id="empt"><div class="empty-ico">🎙</div><div class="empty-t">Say "Hi Rama" to begin</div><div class="empty-s">14 languages · Translation enabled</div></div>';
  $('liveTr').textContent = '—';
}

function exportChat() {
  const logItems = document.querySelectorAll('.msg');
  if (!logItems.length) { debug('Nothing to export yet.'); return; }
  let txt = 'Rama — Regional Voice Assistant\nAustralia · ' + new Date().toLocaleString() + '\n' + '─'.repeat(48) + '\n\n';
  logItems.forEach(item => {
    const who = item.classList.contains('u') ? 'You' : 'Rama';
    const text = item.querySelector('.bbl').textContent;
    const meta = item.querySelector('.meta').textContent;
    txt += `[${who}] ${meta}\n${text}\n\n`;
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }));
  a.download = `Rama_chat_${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
}

// Global initialization
window.addEventListener('DOMContentLoaded', init);
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
