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
    // 調用 Ollama API 進行翻譯
    translateText(request.text, request.targetLang)
      .then(translation => {
        sendResponse({ success: true, translation });
      })
      .catch(error => {
        console.error('[Background] Translation error:', error);
        sendResponse({ success: false, error: error.message });
      });

    // 返回 true 表示會異步發送響應
    return true;
  }
});

/**
 * 調用 Ollama API 進行翻譯
 */
async function translateText(text, targetLang = '繁體中文') {
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
    ollamaUrl: 'http://localhost:11434',
    model: 'gpt-oss:20b',
    targetLanguage: '繁體中文',
    enabled: true
  });
});
