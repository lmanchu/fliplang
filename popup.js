/**
 * Fliplang - Popup Script
 *
 * Settings interface logic
 */

// 載入已保存的設定
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await chrome.storage.sync.get({
    translationEngine: 'google',
    ollamaUrl: 'http://localhost:11434',
    model: 'gpt-oss:20b',
    readingLanguage: '繁體中文',  // 閱讀翻譯：網頁→中文
    writingLanguage: 'English'    // 輸入翻譯：中文→英文
  });

  document.getElementById('translationEngine').value = settings.translationEngine;
  document.getElementById('ollamaUrl').value = settings.ollamaUrl;
  document.getElementById('model').value = settings.model;
  document.getElementById('readingLanguage').value = settings.readingLanguage;
  document.getElementById('writingLanguage').value = settings.writingLanguage;

  // 根據引擎顯示/隱藏 Ollama 設定
  toggleOllamaSettings(settings.translationEngine);

  // 載入使用統計
  loadUsageStats();
});

// 監聽引擎切換
document.getElementById('translationEngine').addEventListener('change', (e) => {
  toggleOllamaSettings(e.target.value);
});

/**
 * 根據選擇的引擎顯示/隱藏 Ollama 設定
 */
function toggleOllamaSettings(engine) {
  const ollamaSettings = document.getElementById('ollamaSettings');
  const testBtn = document.getElementById('testBtn');

  if (engine === 'ollama') {
    ollamaSettings.style.display = 'block';
    testBtn.style.display = 'block';
  } else {
    ollamaSettings.style.display = 'none';
    testBtn.style.display = 'none';
  }
}

// 儲存設定
document.getElementById('saveBtn').addEventListener('click', async () => {
  const settings = {
    translationEngine: document.getElementById('translationEngine').value,
    ollamaUrl: document.getElementById('ollamaUrl').value,
    model: document.getElementById('model').value,
    readingLanguage: document.getElementById('readingLanguage').value,
    writingLanguage: document.getElementById('writingLanguage').value
  };

  try {
    await chrome.storage.sync.set(settings);
    const engine = settings.translationEngine === 'google' ? 'Google Translate' : 'Ollama';
    showStatus(`設定已儲存！
閱讀→${settings.readingLanguage}
輸入→${settings.writingLanguage}`, 'success');
  } catch (error) {
    showStatus('儲存失敗: ' + error.message, 'error');
  }
});

// 測試連線
document.getElementById('testBtn').addEventListener('click', async () => {
  const ollamaUrl = document.getElementById('ollamaUrl').value;
  const model = document.getElementById('model').value;

  showStatus('正在測試連線...', 'info');

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: 'Hello',
        stream: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      showStatus(`✓ 連線成功！模型 ${model} 正常運作`, 'success');
    } else {
      showStatus(`✗ 連線失敗: HTTP ${response.status}`, 'error');
    }
  } catch (error) {
    showStatus(`✗ 連線失敗: ${error.message}`, 'error');
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
