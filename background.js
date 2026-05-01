/**
 * Fliplang - Background Service Worker
 *
 * Responsible for:
 * 1. Listening to keyboard shortcuts
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
    // 先檢查使用限制
    checkUsageLimit()
      .then(({ allowed, remaining, isPro }) => {
        if (!allowed && !isPro) {
          // 超過免費額度
          sendResponse({
            success: false,
            error: 'Daily translation limit reached',
            limitReached: true,
            remaining: 0
          });
          return;
        }

        // 根據用戶設定選擇翻譯引擎（dispatch table 取代寫死的 if/else）
        chrome.storage.sync.get({ translationEngine: 'google' }, (settings) => {
          const translateFn = PROVIDERS[settings.translationEngine] || translateWithGoogle;

          translateFn(request.text, request.targetLang)
            .then(translation => {
              // 翻譯成功，增加計數
              incrementUsageCount();
              sendResponse({
                success: true,
                translation,
                remaining: remaining - 1
              });
            })
            .catch(error => {
              console.error('[Background] Translation error:', error);
              sendResponse({ success: false, error: error.message });
            });
        });
      })
      .catch(error => {
        console.error('[Background] Usage limit check error:', error);
        sendResponse({ success: false, error: error.message });
      });

    // 返回 true 表示會異步發送響應
    return true;
  }

  if (request.action === 'getUsageStats') {
    // 獲取使用統計
    getUsageStats()
      .then(stats => {
        sendResponse({ success: true, stats });
      })
      .catch(error => {
        console.error('[Background] Get usage stats error:', error);
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }

  // 測試指定 provider — popup 的「測試連線」按鈕用
  // 跳過 quota check，直接呼叫指定 provider 翻譯一句短文
  if (request.action === 'testProvider') {
    const provider = request.provider;
    const fn = PROVIDERS[provider];
    if (!fn) {
      sendResponse({ success: false, error: `Unknown provider: ${provider}` });
      return true;
    }
    fn('Hello, this is a connection test.', '繁體中文')
      .then(translation => sendResponse({ success: true, translation }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

/**
 * ============================================
 * Freemium 使用限制管理
 * ============================================
 */

const DAILY_FREE_LIMIT = 50; // 免費版每日翻譯上限
const DOGFOOD_MODE = true;   // dogfood: 跳過 quota，自用無限制

/**
 * 檢查使用限制
 */
async function checkUsageLimit() {
  const today = new Date().toDateString(); // 例如: "Thu Nov 14 2025"

  // Dogfood: 自用版本不卡 quota
  if (DOGFOOD_MODE) {
    return { allowed: true, remaining: DAILY_FREE_LIMIT, isPro: true };
  }

  const data = await chrome.storage.local.get({
    isPro: false,
    usageCount: 0,
    lastResetDate: today
  });

  // Pro 用戶無限制
  if (data.isPro) {
    return { allowed: true, remaining: Infinity, isPro: true };
  }

  // 檢查是否需要重置計數（新的一天）
  if (data.lastResetDate !== today) {
    console.log('[Background] New day detected, resetting usage count');
    await chrome.storage.local.set({
      usageCount: 0,
      lastResetDate: today
    });
    return { allowed: true, remaining: DAILY_FREE_LIMIT, isPro: false };
  }

  // 檢查是否超過限制
  const remaining = DAILY_FREE_LIMIT - data.usageCount;
  const allowed = data.usageCount < DAILY_FREE_LIMIT;

  console.log(`[Background] Usage: ${data.usageCount}/${DAILY_FREE_LIMIT}, Remaining: ${remaining}`);

  return { allowed, remaining, isPro: false };
}

/**
 * 增加使用計數
 */
async function incrementUsageCount() {
  const today = new Date().toDateString();

  const data = await chrome.storage.local.get({
    usageCount: 0,
    lastResetDate: today
  });

  const newCount = data.usageCount + 1;

  await chrome.storage.local.set({
    usageCount: newCount,
    lastResetDate: today
  });

  console.log(`[Background] Usage count incremented: ${newCount}/${DAILY_FREE_LIMIT}`);
}

/**
 * 獲取使用統計
 */
async function getUsageStats() {
  const today = new Date().toDateString();

  const data = await chrome.storage.local.get({
    isPro: false,
    usageCount: 0,
    lastResetDate: today
  });

  // 如果不是今天的數據，重置為 0
  const isToday = data.lastResetDate === today;
  const usageCount = isToday ? data.usageCount : 0;

  return {
    isPro: data.isPro,
    usageCount: usageCount,
    limit: DAILY_FREE_LIMIT,
    remaining: DAILY_FREE_LIMIT - usageCount,
    resetDate: today
  };
}

/**
 * ============================================
 * Glossary — 已知誤翻 post-process 修正
 * ============================================
 *
 * 跨 provider（Google free / Ollama / 未來 BYOK）一致套用。
 * 純 string replace，最簡單最可靠。
 *
 * 邊界處理：中文/日文無空格，String.prototype.replaceAll 直接用。
 * 注意：post-fix 對所有 occurrence 替換，假設這些誤翻在實務中
 * 99% 都是該還原的（IT 內容情境）。如果你讀法律文件需要
 * 「法學碩士」原文，把對應 fix 從 user glossary 移除即可。
 */
const DEFAULT_GLOSSARY_FIXES = {
  '法學碩士': 'LLM',
  '法律碩士': 'LLM',
};

/**
 * 從 chrome.storage.sync 讀 user glossary，與 default 合併。
 * User fix 優先（可覆寫 default，例如把 '法學碩士' map 成你想要的別的詞）。
 */
async function getMergedGlossaryFixes() {
  const data = await chrome.storage.sync.get({ glossaryFixes: {} });
  return { ...DEFAULT_GLOSSARY_FIXES, ...(data.glossaryFixes || {}) };
}

/**
 * 對翻譯結果套用 glossary 修正。
 * 失敗 / 空 dict 時直接回傳原文。
 */
async function applyGlossary(text) {
  if (!text) return text;
  try {
    const fixes = await getMergedGlossaryFixes();
    let result = text;
    for (const [wrong, right] of Object.entries(fixes)) {
      if (wrong && right !== undefined) {
        result = result.split(wrong).join(right); // 等同 replaceAll，相容性更廣
      }
    }
    return result;
  } catch (e) {
    console.warn('[Background] applyGlossary failed:', e);
    return text;
  }
}

/**
 * ============================================
 * 翻譯引擎
 * ============================================
 */

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
    return await applyGlossary(translations);
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
    return await applyGlossary(data.response.trim());
  } catch (error) {
    console.error('[Background] Ollama API error:', error);
    console.error('[Background] Error details:', error.message);
    throw error;
  }
}

/**
 * ============================================
 * BYOK Providers — OpenAI / Anthropic / Gemini / CLIProxy
 * ============================================
 *
 * Storage convention:
 *   chrome.storage.local : API keys（不跨設備同步，避免上 Google sync server）
 *   chrome.storage.sync  : engine 選擇 / model / URL（可跨設備）
 *
 * 所有 LLM provider 共用相同 prompt 結構：system 指令 + user 內容。
 * 翻譯結果結尾呼叫 applyGlossary() 統一過 post-fix。
 */

const LLM_TRANSLATE_SYSTEM_PROMPT = (targetLang) =>
  `You are a precise translator. Translate the user's text into ${targetLang}. ` +
  `Output ONLY the translation — no commentary, no explanations, no quotes, no thinking process. ` +
  `Preserve technical terms (e.g. LLM, API, GPU, JSON, YAML) and proper nouns in their original form.`;

/**
 * OpenAI Chat Completions
 */
async function translateWithOpenAI(text, targetLang = '繁體中文') {
  const localData = await chrome.storage.local.get('openaiApiKey');
  const syncData = await chrome.storage.sync.get({ openaiModel: 'gpt-4o-mini' });
  if (!localData.openaiApiKey) throw new Error('OpenAI API key not set. Set it in popup settings.');

  console.log('[Background] OpenAI translate:', text.substring(0, 50), '→', targetLang, '(', syncData.openaiModel, ')');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localData.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: syncData.openaiModel,
      messages: [
        { role: 'system', content: LLM_TRANSLATE_SYSTEM_PROMPT(targetLang) },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API ${response.status}: ${errText.substring(0, 200)}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('OpenAI returned empty content');
  return await applyGlossary(content);
}

/**
 * Anthropic Messages API
 * 註：browser 直連 Anthropic 需要 anthropic-dangerous-direct-browser-access header
 */
async function translateWithAnthropic(text, targetLang = '繁體中文') {
  const localData = await chrome.storage.local.get('anthropicApiKey');
  const syncData = await chrome.storage.sync.get({ anthropicModel: 'claude-haiku-4-5' });
  if (!localData.anthropicApiKey) throw new Error('Anthropic API key not set. Set it in popup settings.');

  console.log('[Background] Anthropic translate:', text.substring(0, 50), '→', targetLang, '(', syncData.anthropicModel, ')');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': localData.anthropicApiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: syncData.anthropicModel,
      max_tokens: 4096,
      system: LLM_TRANSLATE_SYSTEM_PROMPT(targetLang),
      messages: [{ role: 'user', content: text }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API ${response.status}: ${errText.substring(0, 200)}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text?.trim();
  if (!content) throw new Error('Anthropic returned empty content');
  return await applyGlossary(content);
}

/**
 * Google Gemini generateContent
 */
async function translateWithGemini(text, targetLang = '繁體中文') {
  const localData = await chrome.storage.local.get('geminiApiKey');
  const syncData = await chrome.storage.sync.get({ geminiModel: 'gemini-2.5-flash' });
  if (!localData.geminiApiKey) throw new Error('Gemini API key not set. Set it in popup settings.');

  console.log('[Background] Gemini translate:', text.substring(0, 50), '→', targetLang, '(', syncData.geminiModel, ')');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${syncData.geminiModel}:generateContent?key=${localData.geminiApiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: LLM_TRANSLATE_SYSTEM_PROMPT(targetLang) }] },
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: { temperature: 0.3 },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API ${response.status}: ${errText.substring(0, 200)}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!content) throw new Error('Gemini returned empty content');
  return await applyGlossary(content);
}

/**
 * CLIProxy (OpenAI-compatible) — 本機 OAuth 零邊際成本
 * https://github.com/router-for-me/CLIProxyAPI
 */
async function translateWithCLIProxy(text, targetLang = '繁體中文') {
  const localData = await chrome.storage.local.get('cliproxyApiKey');
  const syncData = await chrome.storage.sync.get({
    cliproxyUrl: 'http://127.0.0.1:8317',
    cliproxyModel: 'claude-sonnet-4-6',
  });
  if (!localData.cliproxyApiKey) throw new Error('CLIProxy API key not set. Default key is magi-proxy-key-2026.');

  console.log('[Background] CLIProxy translate:', text.substring(0, 50), '→', targetLang, '(', syncData.cliproxyModel, ')');

  const response = await fetch(`${syncData.cliproxyUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localData.cliproxyApiKey}`,
    },
    body: JSON.stringify({
      model: syncData.cliproxyModel,
      messages: [
        { role: 'system', content: LLM_TRANSLATE_SYSTEM_PROMPT(targetLang) },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`CLIProxy ${response.status}: ${errText.substring(0, 200)}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('CLIProxy returned empty content');
  return await applyGlossary(content);
}

/**
 * Provider dispatch table — message handler 用 settings.translationEngine 查表
 * 新增 provider 只在這裡加一行。
 */
const PROVIDERS = {
  google:    translateWithGoogle,
  ollama:    translateWithOllama,
  openai:    translateWithOpenAI,
  anthropic: translateWithAnthropic,
  gemini:    translateWithGemini,
  cliproxy:  translateWithCLIProxy,
};

// Extension 安裝時的初始化
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Background] Fliplang installed');

  // 設置默認配置（不覆寫已有 key）
  chrome.storage.sync.set({
    translationEngine: 'google',
    ollamaUrl: 'http://localhost:11434',
    model: 'gpt-oss:20b',
    openaiModel: 'gpt-4o-mini',
    anthropicModel: 'claude-haiku-4-5',
    geminiModel: 'gemini-2.5-flash',
    cliproxyUrl: 'http://127.0.0.1:8317',
    cliproxyModel: 'claude-sonnet-4-6',
    readingLanguage: '繁體中文',
    writingLanguage: 'English',
    enabled: true
  });
});
