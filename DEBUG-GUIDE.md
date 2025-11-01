# 🐛 Hover 翻譯調試指南

## 步驟 1: 重新載入 Extension

1. 打開 BrowserOS / Chrome
2. 進入 `chrome://extensions/`
3. 找到 "Iris Immersive Translate"
4. 點擊 🔄 **重新載入** 按鈕（非常重要！）

## 步驟 2: 打開測試頁面

1. 打開 `file:///Users/lman/iris-immersive-translate/test-hover.html`
2. 按 `F12` 打開 DevTools
3. 切換到 **Console** 標籤

## 步驟 3: 檢查 Content Script 是否載入

在 Console 中應該看到：
```
[Iris Translate] Content script loaded
```

如果沒有看到，說明 content script 沒有正確載入。

## 步驟 4: 測試 Hover 追蹤

1. 將滑鼠移動到測試頁面的段落上
2. 在 Console 應該看到：
```
[Content] Hovered element: P Artificial intelligence is ra...
```

每次移到不同的段落，都應該看到新的日誌。

## 步驟 5: 測試 Ctrl 鍵觸發

1. 確保滑鼠停在某個段落上
2. 按下 `Ctrl` 鍵（Mac 上按 `Cmd` 鍵）
3. 在 Console 應該看到：
```
[Content] Ctrl/Cmd pressed, hoveredElement: <p>...</p>
[Content] Hover translation for: Artificial intelligence is...
[Content] Split into sentences: 3
```

## 步驟 6: 檢查翻譯結果

如果一切正常：
- 段落的不透明度會變成 0.6（半透明）
- 右上角會出現「正在翻譯...」通知
- 每個句子會被翻譯
- 翻譯完成後，段落會顯示雙語對照
- 每個句子的譯文會顯示在原文下方，帶紫色左邊框

## 常見問題

### Q1: Console 沒有任何 [Iris Translate] 日誌
**解決方法：**
- 確認 Extension 已重新載入
- 確認測試頁面已刷新（Cmd+R）
- 檢查 Extension 是否在 chrome://extensions/ 中啟用

### Q2: 有 "Hovered element" 但沒有 "Ctrl/Cmd pressed"
**解決方法：**
- 確認按的是單獨的 Ctrl 鍵，不要同時按 Shift 或 Alt
- 在 Mac 上使用 Cmd 鍵
- 檢查 Console 是否有 JavaScript 錯誤

### Q3: 有 "Ctrl/Cmd pressed" 但沒有翻譯
**解決方法：**
- 檢查 Ollama 是否正在運行：`ollama list`
- 檢查 Service Worker 日誌：
  - 進入 chrome://extensions/
  - 找到 Iris Immersive Translate
  - 點擊「Service Worker」
  - 查看是否有 API 錯誤

### Q4: 翻譯失敗，顯示 403 錯誤
**解決方法：**
- 確認 Ollama CORS 設定正確
- 執行測試：
```bash
curl -v -X POST http://localhost:11434/api/generate \
  -H "Origin: chrome-extension://test" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-oss:20b","prompt":"test","stream":false}'
```
- 應該看到 `Access-Control-Allow-Origin: *`

## 完整測試腳本

```bash
# 1. 確認 Ollama 運行中
ollama list

# 2. 檢查 LaunchAgent 狀態
launchctl list | grep ollama

# 3. 查看 Ollama 日誌
tail -f /tmp/ollama-stdout.log

# 4. 測試 CORS
curl -I -X OPTIONS http://localhost:11434/api/generate \
  -H "Origin: chrome-extension://test" \
  -H "Access-Control-Request-Method: POST"
```

## 開發者工具快捷鍵

- **Console**: `Cmd+Option+J`
- **刷新頁面**: `Cmd+R`
- **硬刷新**: `Cmd+Shift+R`
- **清除 Console**: `Cmd+K`
