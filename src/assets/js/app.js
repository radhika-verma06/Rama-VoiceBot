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

  // API Panel Setup
  const apiInput = $('apiInput');
  const btnSaveApi = $('btnSaveApi');
  if (apiInput && btnSaveApi) {
    const savedKey = localStorage.getItem('ramaCustomGroqKey');
    if (savedKey) apiInput.value = savedKey;
    
    btnSaveApi.onclick = () => {
      const val = apiInput.value.trim();
      if (val) {
        localStorage.setItem('ramaCustomGroqKey', val);
        updateApiStatusBadge('custom');
        debug('Custom API Key saved locally!');
        setStatus('Key Saved', 'Custom Groq key will be used for AI requests.');
      } else {
        localStorage.removeItem('ramaCustomGroqKey');
        updateApiStatusBadge('cloud');
        debug('Custom API Key cleared.');
        setStatus('Key Cleared', 'Restored default Rama Cloud connection.');
      }
    };
  }
  updateApiStatusBadge(localStorage.getItem('ramaCustomGroqKey') ? 'custom' : 'cloud');

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

  const customKey = localStorage.getItem('ramaCustomGroqKey');
  const activeMode = customKey ? 'custom' : 'cloud';

  if (aiResult) {
    updateApiStatusBadge(activeMode);
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
    updateApiStatusBadge('offline');
    const langConfig = RESP[curLang.code] || RESP['en-US'];
    reply = langConfig.think(text);
    
    if (!window.ramaFallbackNotified) {
      window.ramaFallbackNotified = true;
      setTimeout(() => {
        debug('Cloud rate-limited. Running in Offline Fallback Mode.');
        setStatus('Offline Fallback Active', 'Cloud limits reached. Insert a Groq API Key in settings to restore full AI.');
      }, 500);
    }
  }
  
  const modeLabel = aiResult 
    ? (customKey ? 'Custom Groq AI' : 'Rama Cloud AI') 
    : 'Offline Fallback';
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

function updateApiStatusBadge(mode) {
  const badge = $('apiStatus');
  const headerBadge = $('cModel');
  if (!badge) return;
  
  if (mode === 'custom') {
    badge.textContent = 'Custom Key';
    badge.className = 'api-badge';
    badge.style.borderColor = 'var(--teal)';
    badge.style.color = 'var(--teal)';
    badge.style.background = 'rgba(0, 232, 176, 0.07)';
    if (headerBadge) {
      headerBadge.textContent = 'CUSTOM KEY';
      headerBadge.className = 'chip on';
    }
  } else if (mode === 'offline') {
    badge.textContent = 'Offline Mode';
    badge.className = 'api-badge err';
    badge.removeAttribute('style');
    if (headerBadge) {
      headerBadge.textContent = 'OFFLINE';
      headerBadge.className = 'chip';
      headerBadge.style.borderColor = 'rgba(255, 95, 95, 0.5)';
      headerBadge.style.background = 'rgba(255, 95, 95, 0.09)';
      headerBadge.style.color = 'var(--red)';
    }
  } else {
    badge.textContent = 'Rama Cloud';
    badge.className = 'api-badge';
    badge.removeAttribute('style');
    if (headerBadge) {
      headerBadge.textContent = 'RAMA CLOUD';
      headerBadge.className = 'chip ai';
      headerBadge.removeAttribute('style');
    }
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', init);
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
