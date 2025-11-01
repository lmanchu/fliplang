/**
 * Iris Immersive Translate - Popup Script
 *
 * 設定介面邏輯
 */

// 載入已保存的設定
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await chrome.storage.sync.get({
    ollamaUrl: 'http://localhost:11434',
    model: 'gpt-oss:20b',
    targetLanguage: '繁體中文'
  });

  document.getElementById('ollamaUrl').value = settings.ollamaUrl;
  document.getElementById('model').value = settings.model;
  document.getElementById('targetLanguage').value = settings.targetLanguage;
});

// 儲存設定
document.getElementById('saveBtn').addEventListener('click', async () => {
  const settings = {
    ollamaUrl: document.getElementById('ollamaUrl').value,
    model: document.getElementById('model').value,
    targetLanguage: document.getElementById('targetLanguage').value
  };

  try {
    await chrome.storage.sync.set(settings);
    showStatus('設定已儲存！', 'success');
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
