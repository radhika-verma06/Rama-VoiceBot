/**
 * Language configurations and hardcoded responses for Rama Voice Assistant.
 */

export const LANGS = [
  { code: 'en-US', name: 'English', flag: '🇦🇺', tts: 'en', fallbackTts: null },
  { code: 'zh-CN', name: 'Mandarin', flag: '🇨🇳', tts: 'zh', fallbackTts: 'zh' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦', tts: 'ar', fallbackTts: 'ar' },
  { code: 'vi-VN', name: 'Vietnamese', flag: '🇻🇳', tts: 'vi', fallbackTts: 'en' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹', tts: 'it', fallbackTts: 'it' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳', tts: 'hi', fallbackTts: 'hi' },
  { code: 'el-GR', name: 'Greek', flag: '🇬🇷', tts: 'el', fallbackTts: 'en' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸', tts: 'es', fallbackTts: 'es' },
  { code: 'tl-PH', name: 'Filipino', flag: '🇵🇭', tts: 'fil', fallbackTts: 'en' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷', tts: 'ko', fallbackTts: 'ko' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷', tts: 'fr', fallbackTts: 'fr' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪', tts: 'de', fallbackTts: 'de' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷', tts: 'pt', fallbackTts: 'pt' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵', tts: 'ja', fallbackTts: 'ja' },
];

export const RESP = {
  'en-US': {
    wake: n => `Hi${n ? ', ' + n : ''}! I'm Rama, your guide for Australia. I can help with directions, transport, food, emergency contacts, attractions, weather, and more. What do you need?`,
    think: t => {
      const q = t.toLowerCase();
      if (/how are you/.test(q)) return "I'm great, thanks for asking! How can I help you today?";
      if (/your name|who are you/.test(q)) return "I'm Rama, your regional voice assistant for Australia. I speak 14 languages!";
      if (/direction|how.*get|navigate|map|route|way to/.test(q)) return "For directions use Google Maps or Apple Maps. Sydney uses Opal cards, Melbourne uses Myki, Brisbane uses Go cards for public transport.";
      if (/transport|bus|train|tram|ferry|opal|myki|go card|uber|taxi/.test(q)) return "Australia has great public transport. Sydney: Opal card. Melbourne: Myki. Brisbane: Go card. Uber and taxis are also widely available.";
      if (/food|eat|restaurant|hungry|cafe|coffee/.test(q)) return "Australia has amazing food! Every city has great multicultural cuisine. Ask me about a specific city for local tips.";
      if (/emergency|police|ambulance|fire|000|accident|help/.test(q)) return "Emergency number in Australia is 000. This covers police, fire and ambulance. For non-emergency police call 131 444.";
      if (/attract|sight|visit|tourist|landmark|museum|beach|zoo/.test(q)) return "Top Australian attractions: Sydney Opera House, Great Barrier Reef, Uluru, Great Ocean Road, Blue Mountains, Bondi Beach. Which city are you in?";
      if (/weather|temperature|rain|hot|cold|season/.test(q)) return "Australia has varied climates. Summer is December to February. Winter is June to August. Always wear sunscreen! UV is very high.";
      if (/hello|hi\b|hey\b/.test(q)) return "Hello! I am Rama. What would you like to know about Australia?";
      if (/thank/.test(q)) return "You are welcome! Anything else I can help with?";
      return "I can help with directions, transport, food, emergency contacts, attractions, weather, money, health, phones, and safety in Australia. What would you like to know?";
    }
  },
  'hi-IN': {
    wake: n => `Namaste${n ? ', ' + n : ''}! Main Rama hoon, Australia mein aapka guide. Aapko kya chahiye?`,
    think: t => {
      const q = t.toLowerCase();
      if (/namaste|namaskar|hello/.test(q)) return 'Namaste! Main Rama hoon. Kya madad kar sakta hoon?';
      if (/raasta|kahan|kaise jaun|map/.test(q)) return 'Google Maps use karein. Sydney: Opal, Melbourne: Myki, Brisbane: Go card.';
      if (/bus|train|taxi|uber/.test(q)) return 'Sydney: Opal card. Melbourne: Myki. Brisbane: Go card.';
      if (/khana|restaurant|bhook/.test(q)) return 'Australia mein bahut achha khana milta hai! Aap kis city mein hain?';
      if (/emergency|police|ambulance|000/.test(q)) return 'Emergency number 000 hai.';
      if (/shukriya|dhanyavaad|thanks/.test(q)) return 'Koi baat nahi! Aur koi sawaal?';
      return 'Main directions, transport, khana, emergency ke baare mein madad kar sakta hoon.';
    }
  },
  'zh-CN': {
    wake: n => `你好${n ? '，' + n : ''}！我是Rama，您在澳大利亚的本地向导。请问有什么需要帮助的？`,
    think: t => {
      if (/你好|您好|嗨/.test(t)) return '你好！我是Rama。请问需要什么帮助？';
      if (/方向|路线|怎么去|导航/.test(t)) return '推荐使用谷歌地图导航。悉尼公交用Opal卡，墨尔本用Myki卡，布里斯班用Go卡。';
      if (/紧急|急救|警察|救护车|000/.test(t)) return '澳大利亚紧急电话：000（警察、救护、消防）。';
      if (/谢谢|感谢/.test(t)) return '不客气！还有什么需要帮助的吗？';
      return '我可以帮助您了解澳大利亚的交通、美食、紧急联系、景点、天气等信息。';
    }
  },
  'ar-SA': {
    wake: n => `مرحبا${n ? '، ' + n : ''}! أنا راما، دليلك في أستراليا. بماذا يمكنني مساعدتك؟`,
    think: t => {
      if (/مرحبا|أهلا|السلام/.test(t)) return 'مرحبا! أنا راما. كيف يمكنني مساعدتك؟';
      if (/طوارئ|شرطة|إسعاف|000/.test(t)) return 'رقم الطوارئ: 000 للشرطة والإسعاف والإطفاء.';
      if (/شكرا/.test(t)) return 'عفوا! هل تحتاج مساعدة أخرى؟';
      return 'يمكنني مساعدتك في الاتجاهات والمواصلات والطعام والطوارئ في أستراليا.';
    }
  },
  'vi-VN': {
    wake: n => `Xin chào${n ? ', ' + n : ''}! Tôi là Rama, hướng dẫn viên của bạn tại Úc. Bạn cần gì?`,
    think: t => {
      const q = t.toLowerCase();
      if (/xin chào|chào|hello/.test(q)) return 'Xin chào! Tôi là Rama. Tôi có thể giúp gì cho bạn?';
      if (/khẩn cấp|cảnh sát|000/.test(q)) return 'Số khẩn cấp tại Úc: 000.';
      if (/cảm ơn/.test(q)) return 'Không có gì! Bạn cần thêm thông tin gì không?';
      return 'Tôi có thể giúp về đường đi, giao thông, ẩm thực, khẩn cấp tại Úc.';
    }
  },
  'it-IT': {
    wake: n => `Ciao${n ? ', ' + n : ''}! Sono Rama, la tua guida in Australia. Cosa ti serve?`,
    think: t => {
      const q = t.toLowerCase();
      if (/ciao|salve|buon/.test(q)) return 'Ciao! Sono Rama. Come posso aiutarti?';
      if (/emergenza|polizia|ambulanza|000/.test(q)) return 'Numero emergenze: 000.';
      if (/grazie/.test(q)) return 'Prego! Posso aiutarti con altro?';
      return "Posso aiutarti con indicazioni, trasporti, cibo, emergenze in Australia.";
    }
  },
  'el-GR': {
    wake: n => `Γεια σου${n ? ', ' + n : ''}! Είμαι η Rama, ο οδηγός σου στην Αυστραλία. Τι χρειάζεσαι;`,
    think: t => {
      if (/γεια|χαίρε/.test(t)) return 'Γεια! Είμαι η Rama. Πώς μπορώ να σε βοηθήσω;';
      if (/έκτακτο|αστυνομία|000/.test(t)) return 'Αριθμός έκτακτης ανάγκης: 000.';
      if (/ευχαριστώ/.test(t)) return 'Παρακαλώ! Χρειάζεσαι κάτι άλλο;';
      return 'Μπορώ να βοηθήσω με κατευθύνσεις, μεταφορές, φαγητό στην Αυστραλία.';
    }
  },
  'es-ES': {
    wake: n => `Hola${n ? ', ' + n : ''}! Soy Rama, tu guia en Australia. Que necesitas?`,
    think: t => {
      const q = t.toLowerCase();
      if (/hola|buenos|buenas/.test(q)) return 'Hola! Soy Rama. Como puedo ayudarte?';
      if (/emergencia|policia|ambulancia|000/.test(q)) return 'Numero de emergencies: 000.';
      if (/gracias/.test(q)) return 'De nada! Necesitas algo mas?';
      return 'Puedo ayudarte con direcciones, transporte, comida, emergencies en Australia.';
    }
  },
  'tl-PH': {
    wake: n => `Kumusta${n ? ', ' + n : ''}! Ako si Rama, ang iyong gabay sa Australia. Ano ang kailangan mo?`,
    think: t => {
      const q = t.toLowerCase();
      if (/kumusta|hello|kamusta/.test(q)) return 'Kumusta! Ako si Rama. Paano kita matutulungan?';
      if (/emergency|pulis|ambulansya|000/.test(q)) return 'Emergency number: 000.';
      if (/salamat/.test(q)) return 'Walang anuman! May iba pa ba?';
      return 'Makakatulong ako sa direksyon, transportasyon, pagkain, emergency sa Australia.';
    }
  },
  'ko-KR': {
    wake: n => `안녕하세요${n ? ', ' + n : ''}! 저는 Rama, 호주 가이드입니다. 무엇이 필요하세요?`,
    think: t => {
      if (/안녕|안녕하세요/.test(t)) return '안녕하세요! 저는 Rama입니다. 무엇을 도와드릴까요?';
      if (/응급|경찰|000/.test(t)) return '긴급 번호: 000.';
      if (/감사|고마워/.test(t)) return '천만에요! 다른 도움이 필요하신가요?';
      return '길 안내, 교통, 음식, 응급 상황에 대해 도움드릴 수 있습니다.';
    }
  },
  'fr-FR': {
    wake: n => `Bonjour${n ? ', ' + n : ''}! Je suis Rama, votre guide en Australie. Que puis-je faire pour vous?`,
    think: t => {
      const q = t.toLowerCase();
      if (/bonjour|salut|bonsoir/.test(q)) return 'Bonjour! Je suis Rama. Comment puis-je vous aider?';
      if (/urgence|police|ambulance|000/.test(q)) return "Numero d'urgence: 000.";
      if (/merci/.test(q)) return 'De rien! Puis-je vous aider avec autre chose?';
      return "Je peux vous aider avec les itineraires, transports, nourriture, urgences en Australie.";
    }
  },
  'de-DE': {
    wake: n => `Hallo${n ? ', ' + n : ''}! Ich bin Rama, Ihr Reisefuehrer in Australien. Was benoetigen Sie?`,
    think: t => {
      const q = t.toLowerCase();
      if (/hallo|guten|moin/.test(q)) return 'Hallo! Ich bin Rama. Wie kann ich Ihnen helfen?';
      if (/notfall|polizei|krankenwagen|000/.test(q)) return 'Notrufnummer: 000.';
      if (/danke/.test(q)) return 'Bitte sehr! Kann ich noch weiterhelfen?';
      return 'Ich kann bei Wegbeschreibungen, Transport, Essen, Notfaellen helfen.';
    }
  },
  'pt-BR': {
    wake: n => `Ola${n ? ', ' + n : ''}! Sou Rama, seu guia na Australia. O que voce precisa?`,
    think: t => {
      const q = t.toLowerCase();
      if (/ola|oi|bom dia/.test(q)) return 'Ola! Sou Rama. Como posso ajudar?';
      if (/emergencia|policia|ambulancia|000/.test(q)) return 'Numero de emergencia: 000.';
      if (/obrigado|obrigada/.test(q)) return 'De nada! Posso ajudar em mais alguma coisa?';
      return 'Posso ajudar com direcoes, transporte, comida, emergencias na Australia.';
    }
  },
  'ja-JP': {
    wake: n => `こんにちは${n ? '，' + n : ''}！私はRama、オーストラリアのガイドです。何が必要ですか？`,
    think: t => {
      if (/こんにちは|はじめまして/.test(t)) return 'こんにちは！私はRamaです。何かお手伝いできますか？';
      if (/緊急|警察|000/.test(t)) return '緊急番号：000。';
      if (/ありがとう/.test(t)) return 'どういたしまして！他に何かお手伝いできますか？';
      return '道案内、交通、食事、緊急についてお手伝いできます。';
    }
  },
};
