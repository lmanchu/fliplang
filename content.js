/**
 * Iris Immersive Translate - Content Script
 *
 * 負責：
 * 1. 監聽來自 background 的消息
 * 2. 提取頁面文字
 * 3. 顯示翻譯結果（雙語對照）
 * 4. 處理用戶交互
 */

console.log('[Iris Translate] Content script loaded');

// 翻譯狀態
let isTranslating = false;
let translationCache = new Map();

// 監聽來自 background 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Content] Message received:', request);

  if (request.action === 'translate-selection') {
    handleSelectionTranslation();
  } else if (request.action === 'translate-page') {
    handlePageTranslation();
  }

  sendResponse({ received: true });
});

/**
 * 處理選取文字翻譯
 */
async function handleSelectionTranslation() {
  const selectedText = window.getSelection().toString().trim();

  if (!selectedText) {
    showNotification('請先選取要翻譯的文字', 'warning');
    return;
  }

  console.log('[Content] Translating selection:', selectedText);

  // 顯示載入提示
  const loadingTooltip = showLoadingTooltip();

  try {
    const translation = await requestTranslation(selectedText);

    // 移除載入提示
    loadingTooltip.remove();

    // 顯示翻譯結果
    showTranslationTooltip(selectedText, translation);
  } catch (error) {
    console.error('[Content] Translation failed:', error);
    loadingTooltip.remove();
    showNotification('翻譯失敗: ' + error.message, 'error');
  }
}

/**
 * 處理整頁翻譯
 */
async function handlePageTranslation() {
  if (isTranslating) {
    // 如果正在翻譯，則取消翻譯
    removeAllTranslations();
    isTranslating = false;
    showNotification('已取消翻譯', 'info');
    return;
  }

  isTranslating = true;
  showNotification('正在翻譯頁面...', 'info');

  try {
    // 找到所有需要翻譯的文字節點
    const textNodes = getAllTextNodes(document.body);

    console.log('[Content] Found text nodes:', textNodes.length);

    // 批次翻譯
    let translated = 0;
    const batchSize = 5; // 每批翻譯 5 個段落

    for (let i = 0; i < textNodes.length; i += batchSize) {
      const batch = textNodes.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (node) => {
          const text = node.textContent.trim();

          // 跳過太短或純數字的文字
          if (text.length < 10 || /^[\d\s\p{P}]+$/u.test(text)) {
            return;
          }

          try {
            const translation = await requestTranslation(text);
            insertTranslation(node, text, translation);
            translated++;
          } catch (error) {
            console.error('[Content] Failed to translate node:', error);
          }
        })
      );

      // 更新進度
      const progress = Math.round((i + batch.length) / textNodes.length * 100);
      showNotification(`翻譯中... ${progress}%`, 'info');
    }

    isTranslating = false;
    showNotification(`翻譯完成！已翻譯 ${translated} 個段落`, 'success');
  } catch (error) {
    console.error('[Content] Page translation failed:', error);
    isTranslating = false;
    showNotification('翻譯失敗: ' + error.message, 'error');
  }
}

/**
 * 請求翻譯
 */
async function requestTranslation(text) {
  // 檢查緩存
  if (translationCache.has(text)) {
    console.log('[Content] Cache hit:', text.substring(0, 50));
    return translationCache.get(text);
  }

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: 'translate', text },
      (response) => {
        if (response && response.success) {
          // 緩存結果
          translationCache.set(text, response.translation);
          resolve(response.translation);
        } else {
          reject(new Error(response?.error || 'Translation failed'));
        }
      }
    );
  });
}

/**
 * 獲取所有文字節點
 */
function getAllTextNodes(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // 過濾掉 script, style, 和已翻譯的元素
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;

        const tagName = parent.tagName.toLowerCase();
        if (['script', 'style', 'noscript', 'iframe'].includes(tagName)) {
          return NodeFilter.FILTER_REJECT;
        }

        if (parent.classList.contains('iris-translation')) {
          return NodeFilter.FILTER_REJECT;
        }

        const text = node.textContent.trim();
        if (text.length === 0) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  return textNodes;
}

/**
 * 插入翻譯到 DOM
 */
function insertTranslation(textNode, originalText, translation) {
  const parent = textNode.parentElement;
  if (!parent) return;

  // 創建翻譯容器
  const container = document.createElement('span');
  container.className = 'iris-translation-container';

  // 原文
  const original = document.createElement('span');
  original.className = 'iris-original';
  original.textContent = originalText;

  // 譯文
  const translated = document.createElement('span');
  translated.className = 'iris-translated';
  translated.textContent = translation;

  container.appendChild(original);
  container.appendChild(translated);

  // 替換原文字節點
  parent.replaceChild(container, textNode);
}

/**
 * 顯示翻譯提示框（選取翻譯用）
 */
function showTranslationTooltip(originalText, translation) {
  // 移除舊的 tooltip
  const existingTooltip = document.getElementById('iris-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }

  // 創建 tooltip
  const tooltip = document.createElement('div');
  tooltip.id = 'iris-tooltip';
  tooltip.className = 'iris-tooltip';

  tooltip.innerHTML = `
    <div class="iris-tooltip-header">
      <span class="iris-tooltip-title">🌐 翻譯結果</span>
      <button class="iris-tooltip-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
    <div class="iris-tooltip-content">
      <div class="iris-tooltip-original">
        <strong>原文:</strong>
        <p>${escapeHtml(originalText)}</p>
      </div>
      <div class="iris-tooltip-translation">
        <strong>譯文:</strong>
        <p>${escapeHtml(translation)}</p>
      </div>
    </div>
  `;

  // 定位到選取位置附近
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  tooltip.style.left = `${rect.left + window.scrollX}px`;
  tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;

  document.body.appendChild(tooltip);

  // 5 秒後自動消失
  setTimeout(() => {
    tooltip.remove();
  }, 10000);
}

/**
 * 顯示載入提示
 */
function showLoadingTooltip() {
  const tooltip = document.createElement('div');
  tooltip.id = 'iris-loading';
  tooltip.className = 'iris-tooltip iris-loading';
  tooltip.innerHTML = `
    <div class="iris-spinner"></div>
    <span>翻譯中...</span>
  `;

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  tooltip.style.left = `${rect.left + window.scrollX}px`;
  tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;

  document.body.appendChild(tooltip);

  return tooltip;
}

/**
 * 顯示通知
 */
function showNotification(message, type = 'info') {
  // 移除舊通知
  const existing = document.getElementById('iris-notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.id = 'iris-notification';
  notification.className = `iris-notification iris-notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // 3 秒後自動消失
  setTimeout(() => {
    notification.classList.add('iris-notification-fade-out');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * 移除所有翻譯
 */
function removeAllTranslations() {
  const translations = document.querySelectorAll('.iris-translation-container');
  translations.forEach((container) => {
    const originalText = container.querySelector('.iris-original').textContent;
    const textNode = document.createTextNode(originalText);
    container.parentNode.replaceChild(textNode, container);
  });

  translationCache.clear();
}

/**
 * 轉義 HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 監聽點擊空白處關閉 tooltip
document.addEventListener('click', (e) => {
  const tooltip = document.getElementById('iris-tooltip');
  if (tooltip && !tooltip.contains(e.target)) {
    tooltip.remove();
  }
});
