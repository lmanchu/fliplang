/**
 * Iris Immersive Translate - Background Service Worker
 *
 * 負責：
 * 1. 監聽快捷鍵命令
 * 2. 與 content script 通訊
 * 3. 管理翻譯狀態
 */

// 監聽快捷鍵命令
chrome.commands.onCommand.addListener(async (command) => {
  console.log('[Background] Command received:', command);

  // 獲取當前活動的 tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab) {
    console.error('[Background] No active tab found');
    return;
  }

  // 發送消息到 content script
  try {
    await chrome.tabs.sendMessage(tab.id, {
      action: command,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('[Background] Failed to send message:', error);
  }
});

// 監聽來自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Background] Message received:', request);

  if (request.action === 'translate') {
    // 根據用戶設定選擇翻譯引擎
    chrome.storage.sync.get({ translationEngine: 'google' }, (settings) => {
      const translateFn = settings.translationEngine === 'ollama'
        ? translateWithOllama
        : translateWithGoogle;

      translateFn(request.text, request.targetLang)
        .then(translation => {
          sendResponse({ success: true, translation });
        })
        .catch(error => {
          console.error('[Background] Translation error:', error);
          sendResponse({ success: false, error: error.message });
        });
    });

    // 返回 true 表示會異步發送響應
    return true;
  }
});

/**
 * 使用 Google Translate API 進行翻譯（免費）
 */
async function translateWithGoogle(text, targetLang = '繁體中文') {
  // 語言代碼映射（匹配 popup.html 中的選項值）
  const langCodeMap = {
    '繁體中文': 'zh-TW',
    '简体中文': 'zh-CN',
    'English': 'en',
    '日本語': 'ja',
    '한국어': 'ko',
    'Français': 'fr',
    'Deutsch': 'de',
    'Español': 'es'
  };

  const targetCode = langCodeMap[targetLang] || 'zh-TW';

  console.log('[Background] Translating with Google:', text.substring(0, 50));
  console.log('[Background] Target language:', targetLang, '→', targetCode);

  try {
    // 使用 Google Translate 的免費 API endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetCode}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json();

    // Google Translate API 返回的格式: [[[翻譯文字, 原文, null, null, 10]], ...]
    // 提取所有翻譯片段並拼接
    const translations = data[0].map(item => item[0]).join('');

    console.log('[Background] Google translation successful');
    return translations;
  } catch (error) {
    console.error('[Background] Google Translate error:', error);
    throw error;
  }
}

/**
 * 使用 Ollama API 進行翻譯
 */
async function translateWithOllama(text, targetLang = '繁體中文') {
  const settings = await chrome.storage.sync.get({
    ollamaUrl: 'http://localhost:11434',
    model: 'gpt-oss:20b',
    targetLanguage: '繁體中文'
  });

  const actualTargetLang = targetLang || settings.targetLanguage;

  const prompt = `請將以下文字翻譯成${actualTargetLang}，只需回傳翻譯結果，不要包含任何解釋或額外內容：

${text}`;

  console.log('[Background] Translating:', text.substring(0, 50));
  console.log('[Background] Using model:', settings.model);
  console.log('[Background] API URL:', `${settings.ollamaUrl}/api/generate`);

  try {
    const response = await fetch(`${settings.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: settings.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.9
        }
      })
    });

    console.log('[Background] Response status:', response.status);
    console.log('[Background] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Background] Error response:', errorText);
      throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[Background] Translation successful');
    return data.response.trim();
  } catch (error) {
    console.error('[Background] Ollama API error:', error);
    console.error('[Background] Error details:', error.message);
    throw error;
  }
}

// Extension 安裝時的初始化
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Background] Iris Immersive Translate installed');

  // 設置默認配置
  chrome.storage.sync.set({
    translationEngine: 'google',  // 預設使用 Google Translate（快速）
    ollamaUrl: 'http://localhost:11434',
    model: 'gpt-oss:20b',
    readingLanguage: '繁體中文',  // 閱讀翻譯：網頁→中文
    writingLanguage: 'English',   // 輸入翻譯：中文→英文
    enabled: true
  });
});
