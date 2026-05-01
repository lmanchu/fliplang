# 🔍 Extension 除錯步驟

## 檢查 Background Script 日誌

1. 在 BrowserOS 前往：`chrome://extensions/`

2. 找到「Iris Immersive Translate」

3. 點擊「**service worker**」連結（藍色文字）

4. 在打開的 DevTools 視窗中，切換到 **Console** 標籤

5. 在任何網頁選取文字並按 Alt+T

6. 查看 Console 中的錯誤訊息，應該會看到類似：
   ```
   [Background] Command received: translate-selection
   [Background] Message received: ...
   [Background] Ollama API error: ...
   ```

7. 截圖或複製完整的錯誤訊息

---

## 檢查 Content Script 日誌

1. 在 BrowserOS 打開任何網頁（例如 news.ycombinator.com）

2. 按 **F12** 打開 DevTools

3. 切換到 **Console** 標籤

4. 選取文字並按 Alt+T

5. 查看錯誤訊息，應該會看到類似：
   ```
   [Iris Translate] Content script loaded
   [Content] Message received: ...
   [Content] Translating selection: ...
   [Content] Translation failed: ...
   ```

---

## 手動測試 Background Script

在 Background Script 的 Console 中輸入：

```javascript
// 測試翻譯函數
chrome.runtime.sendMessage({
  action: 'translate',
  text: 'Hello World'
}, response => {
  console.log('Response:', response);
});
```

這應該會觸發翻譯並顯示結果或錯誤。

---

## 檢查網絡請求

在 Background Script 的 DevTools 中：

1. 切換到 **Network** 標籤

2. 選取文字並按 Alt+T

3. 查看是否有請求到 `localhost:11434`

4. 點擊該請求，查看：
   - **Headers** 標籤：檢查 Request Headers
   - **Response** 標籤：查看回應內容
   - **Preview** 標籤：查看 HTTP 狀態碼

如果看到 403，檢查 Response Headers 中的錯誤訊息。
