/**
 * Fliplang - Popup Script
 *
 * Settings interface logic
 */

// Sync settings (engine, model, URL, language) - 跨設備
const SYNC_DEFAULTS = {
  translationEngine: 'google',
  ollamaUrl: 'http://localhost:11434',
  model: 'gpt-oss:20b',                      // Ollama model
  openaiModel: 'gpt-4o-mini',
  anthropicModel: 'claude-haiku-4-5',
  geminiModel: 'gemini-2.5-flash',
  cliproxyUrl: 'http://127.0.0.1:8317',
  cliproxyModel: 'claude-sonnet-4-6',
  readingLanguage: '繁體中文',
  writingLanguage: 'English',
};

// Local-only secrets (API keys) - 不跨設備同步
const LOCAL_KEY_FIELDS = ['openaiApiKey', 'anthropicApiKey', 'geminiApiKey', 'cliproxyApiKey'];

document.addEventListener('DOMContentLoaded', async () => {
  const sync = await chrome.storage.sync.get(SYNC_DEFAULTS);
  const local = await chrome.storage.local.get(LOCAL_KEY_FIELDS);

  // 套用 sync 欄位
  for (const [key, val] of Object.entries(sync)) {
    const el = document.getElementById(key);
    if (el) el.value = val;
  }
  // 套用 local key 欄位
  for (const key of LOCAL_KEY_FIELDS) {
    const el = document.getElementById(key);
    if (el && local[key]) el.value = local[key];
  }

  toggleProviderSettings(sync.translationEngine);
  loadUsageStats();
});

// 監聽引擎切換 → show/hide 對應 provider settings
document.getElementById('translationEngine').addEventListener('change', (e) => {
  toggleProviderSettings(e.target.value);
});

/**
 * 顯示選中 provider 的設定區塊，隱藏其他
 */
function toggleProviderSettings(engine) {
  const blocks = document.querySelectorAll('.provider-settings');
  blocks.forEach(b => {
    b.style.display = b.dataset.provider === engine ? 'block' : 'none';
  });
  // testBtn 在所有 LLM provider 都顯示（google 不需要測）
  const testBtn = document.getElementById('testBtn');
  if (testBtn) testBtn.style.display = engine === 'google' ? 'none' : 'block';
}

// 儲存設定
document.getElementById('saveBtn').addEventListener('click', async () => {
  // sync 欄位
  const syncSettings = {};
  for (const key of Object.keys(SYNC_DEFAULTS)) {
    const el = document.getElementById(key);
    if (el) syncSettings[key] = el.value;
  }

  // local key 欄位（只儲存非空，避免覆寫已存的 key）
  const localSettings = {};
  for (const key of LOCAL_KEY_FIELDS) {
    const el = document.getElementById(key);
    if (el && el.value) localSettings[key] = el.value;
  }

  try {
    await chrome.storage.sync.set(syncSettings);
    if (Object.keys(localSettings).length > 0) {
      await chrome.storage.local.set(localSettings);
    }
    showStatus(`✓ 設定已儲存\n引擎：${syncSettings.translationEngine}\n閱讀→${syncSettings.readingLanguage}\n輸入→${syncSettings.writingLanguage}`, 'success');
  } catch (error) {
    showStatus('儲存失敗: ' + error.message, 'error');
  }
});

// 測試連線（用當前選中的 provider）
document.getElementById('testBtn').addEventListener('click', async () => {
  const engine = document.getElementById('translationEngine').value;

  // 先把當前 popup 的設定存起來，再測試（test 會用 storage 讀取 key/url）
  const syncSettings = {};
  for (const key of Object.keys(SYNC_DEFAULTS)) {
    const el = document.getElementById(key);
    if (el) syncSettings[key] = el.value;
  }
  const localSettings = {};
  for (const key of LOCAL_KEY_FIELDS) {
    const el = document.getElementById(key);
    if (el && el.value) localSettings[key] = el.value;
  }
  await chrome.storage.sync.set(syncSettings);
  if (Object.keys(localSettings).length > 0) {
    await chrome.storage.local.set(localSettings);
  }

  showStatus(`正在測試 ${engine}...`, 'info');

  try {
    const response = await chrome.runtime.sendMessage({
      action: 'testProvider',
      provider: engine,
    });
    if (response && response.success) {
      showStatus(`✓ ${engine} 連線成功\n回傳：${response.translation.substring(0, 80)}`, 'success');
    } else {
      showStatus(`✗ ${engine} 失敗：${response?.error || 'unknown error'}`, 'error');
    }
  } catch (error) {
    showStatus(`✗ 測試失敗：${error.message}`, 'error');
  }
});

/**
 * 顯示狀態訊息
 */
function showStatus(message, type) {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;

  if (type !== 'info') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
}

/**
 * 載入使用統計
 */
async function loadUsageStats() {
  try {
    // 向 background script 請求使用統計
    const response = await chrome.runtime.sendMessage({ action: 'getUsageStats' });

    if (response && response.success) {
      const stats = response.stats;
      updateUsageDisplay(stats);
    } else {
      console.error('Failed to load usage stats:', response?.error);
    }
  } catch (error) {
    console.error('Error loading usage stats:', error);
  }
}

/**
 * 更新使用統計顯示
 *
 * Dogfood 階段：所有用戶都顯示無限翻譯，badge = DOGFOOD（不是 PRO，避免商業誤解）。
 * upgrade 按鈕永久隱藏，由 Ko-fi 打賞取代。
 */
function updateUsageDisplay(stats) {
  const usageBarFill = document.getElementById('usageBarFill');
  const usageBarText = document.getElementById('usageBarText');
  const usageText = document.getElementById('usageText');
  const proBadge = document.getElementById('proBadge');
  const upgradeBtn = document.getElementById('upgradeBtn');

  // Dogfood mode: 統一顯示 unlimited，不分 free/pro
  proBadge.textContent = 'DOGFOOD';
  proBadge.style.display = 'inline-block';
  proBadge.style.background = '#a8b8ff';
  proBadge.style.color = '#333';

  usageBarFill.style.width = '100%';
  usageBarText.textContent = '∞';
  usageText.textContent = '無限翻譯 · 個人 dogfood 版本';

  // 永久隱藏 upgrade（已被 Ko-fi 取代）
  upgradeBtn.style.display = 'none';
}
