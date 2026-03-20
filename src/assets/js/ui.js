/**
 * UI Manipulation, Waveform Animation, and Chat Log logic.
 */

export const $ = id => document.getElementById(id);

let waveMode = 'idle';
let wT = 0;
const BARS = 26;
const bars = [];

export function initWaveform(containerId) {
  const container = $(containerId);
  for (let i = 0; i < BARS; i++) {
    const b = document.createElement('div');
    b.className = 'bar';
    container.appendChild(b);
    bars.push(b);
  }
}

export function setWaveMode(mode) {
  waveMode = mode;
  const modeEl = $('wMode');
  if (modeEl) modeEl.textContent = mode.toUpperCase();
}

export function startWaveformAnimation(analyser, freqData) {
  function anim() {
    wT += 0.08;
    if (waveMode === 'listening' && analyser && freqData) {
      analyser.getByteFrequencyData(freqData);
      const bpb = Math.floor(freqData.length / BARS) || 1;
      bars.forEach((b, i) => {
        let s = 0;
        for (let j = 0; j < bpb; j++) s += freqData[i * bpb + j] || 0;
        const h = 3 + (s / bpb / 255) * 28;
        b.style.height = Math.max(3, h) + 'px';
        b.style.background = `rgba(0,232,176,${0.3 + (h / 28) * 0.5})`;
      });
    } else if (waveMode === 'speaking') {
      bars.forEach((b, i) => {
        const h = 8 + 11 * Math.sin(wT + i * 0.28) + 5 * Math.random();
        b.style.height = Math.max(3, h) + 'px';
        b.style.background = `rgba(159,126,255,${0.3 + (h / 24) * 0.4})`;
      });
    } else {
      bars.forEach((b, i) => {
        const h = 3 + 3 * (0.5 + 0.5 * Math.sin(wT * 0.6 + i * 0.22));
        b.style.height = Math.max(3, h) + 'px';
        b.style.background = 'rgba(255,255,255,0.1)';
      });
    }
    requestAnimationFrame(anim);
  }
  anim();
}

export function setStatus(main, sub) {
  $('stM').textContent = main;
  $('stS').innerHTML = sub;
}

export function setOrbClass(cls) {
  $('orb').className = 'orb' + (cls ? ' ' + cls : '');
}

export function debug(msg) {
  $('dbg').textContent = msg;
}

export function getTimeString() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function addChatMessage(text, who, meta, curLangName, opts = {}) {
  const emptyHint = $('empt');
  if (emptyHint) emptyHint.remove();
  
  const msgCountEl = $('cSess');
  const count = parseInt(msgCountEl.textContent) || 0;
  msgCountEl.textContent = (count + 1) + ' msgs';
  
  const row = document.createElement('div');
  row.className = 'msg ' + who;
  
  const bbl = document.createElement('div');
  bbl.className = 'bbl';
  bbl.textContent = text;
  row.appendChild(bbl);
  
  if (opts.translation && opts.detectedLang) {
    const pill = document.createElement('div');
    pill.className = 'trans-pill' + (who === 'b' ? ' b-side' : '');
    const lbl = document.createElement('div');
    lbl.className = 'trans-label';
    lbl.textContent = '🌐 ' + opts.detectedLang + ' → ' + curLangName;
    const txt = document.createElement('div');
    txt.className = 'trans-text';
    txt.textContent = opts.translation;
    pill.appendChild(lbl);
    pill.appendChild(txt);
    row.appendChild(pill);
  }
  
  const m = document.createElement('div');
  m.className = 'meta';
  m.textContent = meta || '';
  row.appendChild(m);
  
  const log = $('log');
  log.appendChild(row);
  log.scrollTop = log.scrollHeight;
  return row;
}

export function showTypingIndicator() {
  const emptyHint = $('empt');
  if (emptyHint) emptyHint.remove();
  
  const row = document.createElement('div');
  row.className = 'msg b';
  row.id = 'typingRow';
  const dots = document.createElement('div');
  dots.className = 'typing-dots';
  dots.innerHTML = '<span></span><span></span><span></span>';
  row.appendChild(dots);
  
  const log = $('log');
  log.appendChild(row);
  log.scrollTop = log.scrollHeight;
}

export function hideTypingIndicator() {
  const row = $('typingRow');
  if (row) row.remove();
}
