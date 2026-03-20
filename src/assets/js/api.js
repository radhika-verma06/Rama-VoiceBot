/**
 * AI Integration via Backend Proxy.
 */

import { debug } from './ui.js';

export async function getAIReply(text, context, langName, apiKey, retries = 2) {
  const useProxy = !apiKey;
  const endpoint = useProxy ? '/api/chat' : 'https://api.anthropic.com/v1/messages';
  
  const headers = { 'Content-Type': 'application/json' };
  let body;

  if (!useProxy) {
    // Direct Browser Access (Legacy/Test mode)
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
    
    // Anthropic requires a specific message format
    body = JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 400,
      system: `You are Rama, a friendly Australia regional assistant. Respond in ${langName} ONLY. Brief (2-3 sentences). 
               IMPORTANT: If the user writes in a DIFFERENT language than ${langName}, start with: 
               [DETECTED: language_name] [TRANSLATED: translation into ${langName}] then your response.`,
      messages: [...context, { role: 'user', content: text }]
    });
  } else {
    // Backend Proxy Access (Production mode)
    body = JSON.stringify({ text, context, langName });
  }

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
        throw new Error(`HTTP ${response.status}: ${errData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      if (!useProxy) {
        // Parse direct Anthropic response to match proxy format
        const rawText = data.content[0].text;
        let detectedLang = null;
        let translation = null;
        
        const dMatch = rawText.match(/\[DETECTED:\s*([^\]]+)\]/i);
        const tMatch = rawText.match(/\[TRANSLATED:\s*([^\]]+)\]/i);
        
        if (dMatch) detectedLang = dMatch[1].trim();
        if (tMatch) translation = tMatch[1].trim();
        
        const reply = rawText
          .replace(/\[DETECTED:[^\]]+\]/gi, '')
          .replace(/\[TRANSLATED:[^\]]+\]/gi, '')
          .trim();
          
        return { reply, detectedLang, translation };
      }
      
      return data;
      
    } catch (e) {
      console.warn(`API attempt ${attempt + 1} failed:`, e);
      if (attempt === retries) {
        debug(`API Error: ${e.message}`);
        return null;
      }
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
}
