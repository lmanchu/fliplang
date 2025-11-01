/**
 * Iris Immersive Translate - Popup Script
 *
 * 設定介面邏輯
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
