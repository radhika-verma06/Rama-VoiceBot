/**
 * AI Integration via Backend Proxy (Groq).
 */

import { debug } from './ui.js';

export async function getAIReply(text, context, langName, retries = 2) {
  // If we're running on a different port (like Live Server), point to the Flask port
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const endpoint = (isLocal && window.location.port !== '5000') 
    ? 'http://localhost:5000/api/chat' 
    : '/api/chat';
  
  const headers = { 'Content-Type': 'application/json' };
  const body = JSON.stringify({ text, context, langName });

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: body,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errData.error || 'Unknown error'}`);
      }
      
      return await response.json(); // Expected { reply, detectedLang, translation }
      
    } catch (e) {
      console.warn(`API attempt ${attempt + 1} failed:`, e);
      if (attempt === retries) {
        debug(`API Error: ${e.message}. Ensuring python app.py is running.`);
        return null;
      }
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
}
