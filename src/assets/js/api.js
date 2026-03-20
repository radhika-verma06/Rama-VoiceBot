/**
 * AI Integration via Backend Proxy.
 */

import { debug } from './ui.js';

export async function getAIReply(text, context, langName, apiKey, retries = 2) {
  // If we have an API key in the frontend, we could use it directly (like the original)
  // But the professional way is to use a backend proxy.
  // We'll support both for compatibility during development.

  const useProxy = !apiKey; // If no frontend key, assume we use the server-side key
  const endpoint = useProxy ? '/api/chat' : 'https://api.anthropic.com/v1/messages';
  
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) {
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          text,
          context,
          langName
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return data; // Expected { reply, detectedLang, translation }
      
    } catch (e) {
      console.warn(`API attempt ${attempt + 1} failed:`, e);
      if (attempt === retries) {
        debug('API error, using fallback');
        return null;
      }
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
}
