/**
 * Fliplang - Content Script
 *
 * Responsible for:
 * 1. Listening to messages from background
 * 2. 提取頁面文字
 * 3. 顯示翻譯結果（雙語對照）
 * 4. 處理用戶交互
 */

console.log('[Iris Translate] Content script loaded');

// 翻譯狀態
let isTranslating = false;
let translationCache = new Map();

// Hover 翻譯狀態
let hoveredElement = null;
let isHoverTranslationActive = false;

// 輸入增強狀態
let spacePressTimes = [];
let currentInputElement = null;

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
 * @param {string} text - 要翻譯的文字
 * @param {string} mode - 翻譯模式：'reading'（閱讀）或 'writing'（輸入）
 */
async function requestTranslation(text, mode = 'reading') {
  // 檢查緩存
  const cacheKey = `${mode}:${text}`;
  if (translationCache.has(cacheKey)) {
    console.log('[Content] Cache hit:', text.substring(0, 50));
    return translationCache.get(cacheKey);
  }

  // 獲取語言設定
  const settings = await chrome.storage.sync.get({
    readingLanguage: '繁體中文',  // 閱讀翻譯
    writingLanguage: 'English'    // 輸入翻譯
  });

  // 根據模式選擇目標語言
  const targetLang = mode === 'writing'
    ? settings.writingLanguage
    : settings.readingLanguage;

  console.log(`[Content] Translation mode: ${mode}, target: ${targetLang}`);

  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(
        {
          action: 'translate',
          text,
          targetLang  // 傳遞目標語言
        },
        (response) => {
          // 檢查 Extension context 是否有效
          if (chrome.runtime.lastError) {
            console.error('[Content] Chrome runtime error:', chrome.runtime.lastError);
            reject(new Error('Extension 已重新載入，請刷新頁面 (Cmd+R)'));
            return;
          }

          if (response && response.success) {
            // 緩存結果（包含模式）
            translationCache.set(cacheKey, response.translation);

            // 顯示剩餘次數（如果不是無限）
            if (response.remaining !== undefined && response.remaining !== Infinity) {
              console.log(`[Content] Remaining translations today: ${response.remaining}`);
            }

            resolve(response.translation);
          } else if (response && response.limitReached) {
            // 超過每日限制
            reject(new Error('🚫 Daily limit reached (50/day). Upgrade to Pro for unlimited translations!'));
          } else {
            reject(new Error(response?.error || 'Translation failed'));
          }
        }
      );
    } catch (error) {
      console.error('[Content] Send message error:', error);
      reject(new Error('Extension 已重新載入，請刷新頁面 (Cmd+R)'));
    }
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

/**
 * ============================================
 * Hover 翻譯功能
 * ============================================
 */

// 監聽滑鼠移動以追蹤 hover 的元素
let lastLoggedElement = null;
document.addEventListener('mousemove', (e) => {
  // 找到最接近的段落元素
  const element = e.target.closest('p, div, span, h1, h2, h3, h4, h5, h6, li, td, th, blockquote, pre');

  if (element && !element.classList.contains('iris-translation-container') &&
      !element.classList.contains('iris-tooltip') &&
      !element.classList.contains('iris-notification')) {

    // 只在元素改變時記錄，避免過多日誌
    if (element !== lastLoggedElement) {
      console.log('[Content] Hovered element:', element.tagName, element.textContent.substring(0, 30) + '...');
      lastLoggedElement = element;
    }

    hoveredElement = element;
  }
});

// 監聽 Ctrl 鍵按下
document.addEventListener('keydown', async (e) => {
  // 只監聽單獨的 Ctrl 鍵（不含其他修飾鍵）
  // 注意：macOS 上也使用 Ctrl，而非 Cmd（避免誤觸發）
  const isCtrlOnly = (e.key === 'Control' && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey);

  if (isCtrlOnly && hoveredElement && !isHoverTranslationActive) {
    console.log('[Content] Ctrl pressed, hoveredElement:', hoveredElement);
    e.preventDefault();
    await handleHoverTranslation();
  }
});

/**
 * 處理 Hover 翻譯
 */
async function handleHoverTranslation() {
  if (!hoveredElement) {
    showNotification('請將滑鼠移到要翻譯的段落上', 'warning');
    return;
  }

  // 檢查是否已經被翻譯過
  if (hoveredElement.classList.contains('iris-hover-translated')) {
    showNotification('此段落已翻譯', 'info');
    return;
  }

  const originalText = hoveredElement.textContent.trim();

  if (!originalText || originalText.length < 5) {
    showNotification('文字太短，無法翻譯', 'warning');
    return;
  }

  console.log('[Content] Hover translation for:', originalText.substring(0, 50));

  isHoverTranslationActive = true;

  // 顯示載入狀態
  hoveredElement.style.opacity = '0.6';
  showNotification('正在翻譯...', 'info');

  try {
    // 分割成句子
    const sentences = splitIntoSentences(originalText);
    console.log('[Content] Split into sentences:', sentences.length);

    // 翻譯每個句子
    const translations = [];
    for (const sentence of sentences) {
      if (sentence.trim().length > 0) {
        const translation = await requestTranslation(sentence);
        translations.push(translation);
      } else {
        translations.push('');
      }
    }

    // 顯示雙語對照
    displaySentenceBySentence(hoveredElement, sentences, translations);

    showNotification('翻譯完成', 'success');
  } catch (error) {
    console.error('[Content] Hover translation failed:', error);
    hoveredElement.style.opacity = '1';
    showNotification('翻譯失敗: ' + error.message, 'error');
  } finally {
    isHoverTranslationActive = false;
  }
}

/**
 * 分割文字為句子
 * 支援中文、英文等多語言
 */
function splitIntoSentences(text) {
  // 移除多餘空白
  text = text.trim();

  // 使用正則表達式分割句子
  // 支援：. ! ? 。！？以及換行
  const sentenceEnders = /([.!?。！？]+[\s]*|[\n]+)/g;

  const parts = text.split(sentenceEnders);
  const sentences = [];

  for (let i = 0; i < parts.length; i += 2) {
    const sentence = parts[i];
    const ender = parts[i + 1] || '';

    if (sentence && sentence.trim().length > 0) {
      sentences.push((sentence + ender).trim());
    }
  }

  // 如果沒有分割成功，返回整段
  if (sentences.length === 0) {
    return [text];
  }

  return sentences;
}

/**
 * 顯示句子逐句翻譯
 */
function displaySentenceBySentence(element, originalSentences, translatedSentences) {
  // 標記為已翻譯
  element.classList.add('iris-hover-translated');

  // 清空原始內容
  element.innerHTML = '';
  element.style.opacity = '1';

  // 為每個句子創建雙語對照
  for (let i = 0; i < originalSentences.length; i++) {
    const sentenceContainer = document.createElement('span');
    sentenceContainer.className = 'iris-sentence-container';

    // 原文
    const originalSpan = document.createElement('span');
    originalSpan.className = 'iris-sentence-original';
    originalSpan.textContent = originalSentences[i];

    // 譯文
    const translatedSpan = document.createElement('span');
    translatedSpan.className = 'iris-sentence-translated';
    translatedSpan.textContent = translatedSentences[i] || '';

    sentenceContainer.appendChild(originalSpan);
    sentenceContainer.appendChild(translatedSpan);

    element.appendChild(sentenceContainer);

    // 句子之間加空格
    if (i < originalSentences.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  }
}

/**
 * ============================================
 * 輸入增強功能 - 三下空格翻譯
 * ============================================
 */

// 監聽所有輸入框的焦點
document.addEventListener('focusin', (e) => {
  const element = e.target;

  // 檢查是否為輸入框或可編輯元素
  if (element.tagName === 'INPUT' ||
      element.tagName === 'TEXTAREA' ||
      element.isContentEditable) {
    currentInputElement = element;
    console.log('[Content] Input element focused:', element.tagName);
  }
});

// 監聽焦點離開
document.addEventListener('focusout', (e) => {
  if (e.target === currentInputElement) {
    currentInputElement = null;
    spacePressTimes = [];
  }
});

// 監聽輸入框中的按鍵
document.addEventListener('keydown', async (e) => {
  // 只處理空格鍵，且必須在輸入框中
  if (e.key === ' ' && currentInputElement) {
    const now = Date.now();

    // 記錄空格按下時間
    spacePressTimes.push(now);

    // 只保留最近3次的時間戳
    if (spacePressTimes.length > 3) {
      spacePressTimes.shift();
    }

    // 檢查是否在 500ms 內按了三次空格
    if (spacePressTimes.length === 3) {
      const firstPress = spacePressTimes[0];
      const lastPress = spacePressTimes[2];
      const timeDiff = lastPress - firstPress;

      console.log('[Content] Three spaces detected, time diff:', timeDiff + 'ms');

      // 如果三次空格在 500ms 內
      if (timeDiff < 500) {
        e.preventDefault(); // 阻止最後一個空格輸入

        // 清除記錄
        spacePressTimes = [];

        // 執行翻譯
        await handleInputTranslation();
      }
    }
  }
});

/**
 * 處理輸入框翻譯
 */
async function handleInputTranslation() {
  if (!currentInputElement) {
    return;
  }

  // 獲取輸入框內容
  let text = '';
  let isContentEditable = false;

  if (currentInputElement.isContentEditable) {
    text = currentInputElement.textContent || '';
    isContentEditable = true;
  } else {
    text = currentInputElement.value || '';
  }

  // 移除末尾的空格（可能有1-2個空格已經輸入）
  text = text.trimEnd();

  if (!text || text.length < 2) {
    showNotification('輸入文字太短，無法翻譯', 'warning');
    return;
  }

  console.log('[Content] Translating input:', text.substring(0, 50));

  // 顯示翻譯中狀態
  showNotification('正在翻譯輸入...', 'info');

  try {
    // 翻譯文字（使用 'writing' 模式）
    const translation = await requestTranslation(text, 'writing');

    // 替換輸入框內容
    if (isContentEditable) {
      currentInputElement.textContent = translation;

      // 將光標移到末尾
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(currentInputElement);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      currentInputElement.value = translation;

      // 將光標移到末尾
      currentInputElement.selectionStart = translation.length;
      currentInputElement.selectionEnd = translation.length;
    }

    // 觸發 input 事件（某些網站需要）
    currentInputElement.dispatchEvent(new Event('input', { bubbles: true }));
    currentInputElement.dispatchEvent(new Event('change', { bubbles: true }));

    showNotification('✓ 翻譯完成', 'success');

    console.log('[Content] Input translation successful');
  } catch (error) {
    console.error('[Content] Input translation failed:', error);
    showNotification('翻譯失敗: ' + error.message, 'error');
  }
}

/**
 * ============================================
 * Floating Ball — 主要入口（取代 hotkey）
 * ============================================
 *
 * - Click ball: toggle 整頁翻譯
 * - Click 右下小點: toggle 本網站「自動翻譯」
 * - Page load: 若 domain in auto-list → 自動翻譯
 */

const AUTO_TRANSLATE_KEY = 'autoTranslateDomains'; // chrome.storage.local: { [domain]: true }
const BALL_POSITION_KEY = 'floatingBallPosition';  // chrome.storage.local: { x: 0..1, y: 0..1 } 視窗比例

function getDomainKey() {
  // 用 hostname 作 key（同 site 跨頁面共用設定）
  return location.hostname || 'unknown';
}

async function isAutoTranslateEnabled(domain) {
  const data = await chrome.storage.local.get({ [AUTO_TRANSLATE_KEY]: {} });
  return !!data[AUTO_TRANSLATE_KEY][domain];
}

async function setAutoTranslateEnabled(domain, enabled) {
  const data = await chrome.storage.local.get({ [AUTO_TRANSLATE_KEY]: {} });
  const map = data[AUTO_TRANSLATE_KEY] || {};
  if (enabled) {
    map[domain] = true;
  } else {
    delete map[domain];
  }
  await chrome.storage.local.set({ [AUTO_TRANSLATE_KEY]: map });
}

async function getSavedBallPosition() {
  const data = await chrome.storage.local.get({ [BALL_POSITION_KEY]: null });
  return data[BALL_POSITION_KEY]; // null = 用預設 bottom-right
}

async function saveBallPosition(xRatio, yRatio) {
  await chrome.storage.local.set({ [BALL_POSITION_KEY]: { x: xRatio, y: yRatio } });
}

function injectFloatingBall() {
  // 避免重複注入（SPA 重新 mount 時）
  if (document.getElementById('iris-floating-ball')) return;

  const ball = document.createElement('div');
  ball.id = 'iris-floating-ball';
  ball.className = 'iris-floating-ball';
  ball.title = 'Fliplang: 拖曳移動 / 點擊翻譯整頁 / 點右下角小點切換本站自動翻譯';

  // 主 icon
  const icon = document.createElement('span');
  icon.className = 'iris-floating-ball-icon';
  icon.textContent = '🌐';
  ball.appendChild(icon);

  // 自動翻譯狀態指示點（右下角）
  const dot = document.createElement('span');
  dot.className = 'iris-floating-ball-dot';
  dot.title = '點此切換：本網站自動翻譯';
  ball.appendChild(dot);

  // ============ Drag + Click 處理 ============
  // mousedown/move/up 區分：移動 < 5px 視為 click，否則 drag 並儲存位置
  const BALL_SIZE = 36;
  const DRAG_THRESHOLD = 5;
  let dragState = null;

  ball.addEventListener('mousedown', (e) => {
    if (e.target === dot) return; // dot 自己處理 click
    if (e.button !== 0) return;    // 只處理左鍵
    const rect = ball.getBoundingClientRect();
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      ballX: rect.left,
      ballY: rect.top,
      moved: false
    };
    ball.classList.add('iris-floating-ball-dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragState) return;
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    if (!dragState.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
      dragState.moved = true;
    }
    if (dragState.moved) {
      let newX = dragState.ballX + dx;
      let newY = dragState.ballY + dy;
      newX = Math.max(4, Math.min(window.innerWidth - BALL_SIZE - 4, newX));
      newY = Math.max(4, Math.min(window.innerHeight - BALL_SIZE - 4, newY));
      ball.style.left = newX + 'px';
      ball.style.top = newY + 'px';
      ball.style.right = 'auto';
      ball.style.bottom = 'auto';
    }
  });

  document.addEventListener('mouseup', async (e) => {
    if (!dragState) return;
    ball.classList.remove('iris-floating-ball-dragging');
    const wasDrag = dragState.moved;
    dragState = null;

    if (!wasDrag) {
      // Click → 觸發整頁翻譯
      handlePageTranslation();
      ball.classList.add('iris-floating-ball-pulse');
      setTimeout(() => ball.classList.remove('iris-floating-ball-pulse'), 400);
    } else {
      // Drag end → 儲存位置（用 viewport 比例，視窗 resize 後仍合理）
      const rect = ball.getBoundingClientRect();
      await saveBallPosition(rect.left / window.innerWidth, rect.top / window.innerHeight);
    }
  });

  // Click dot → toggle auto-translate for this domain
  dot.addEventListener('click', async (e) => {
    e.stopPropagation();
    const domain = getDomainKey();
    const current = await isAutoTranslateEnabled(domain);
    const next = !current;
    await setAutoTranslateEnabled(domain, next);
    ball.classList.toggle('iris-floating-ball-auto-on', next);
    showNotification(
      next
        ? `✓ ${domain} 已加入自動翻譯`
        : `✗ ${domain} 已取消自動翻譯`,
      next ? 'success' : 'info'
    );
  });

  document.body.appendChild(ball);

  // 套用儲存的位置
  getSavedBallPosition().then(pos => {
    if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
      const x = Math.max(4, Math.min(window.innerWidth - BALL_SIZE - 4, pos.x * window.innerWidth));
      const y = Math.max(4, Math.min(window.innerHeight - BALL_SIZE - 4, pos.y * window.innerHeight));
      ball.style.left = x + 'px';
      ball.style.top = y + 'px';
      ball.style.right = 'auto';
      ball.style.bottom = 'auto';
    }
  });

  // 初始 auto-translate 狀態
  isAutoTranslateEnabled(getDomainKey()).then(enabled => {
    ball.classList.toggle('iris-floating-ball-auto-on', enabled);
    if (enabled) {
      console.log('[Fliplang] Auto-translate enabled for', getDomainKey());
      setTimeout(() => {
        if (!isTranslating) handlePageTranslation();
      }, 800);
    }
  });
}

// document_end 之後等 body 存在再 inject
function tryInjectBall() {
  if (document.body) {
    injectFloatingBall();
  } else {
    document.addEventListener('DOMContentLoaded', injectFloatingBall, { once: true });
  }
}
tryInjectBall();
