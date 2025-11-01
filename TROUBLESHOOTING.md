# 🔧 Iris Immersive Translate - 疑難排解指南

## 問題：測試失敗，Ollama 沒在運作

### 診斷步驟

#### 1. 檢查 Ollama 是否運行

```bash
ps aux | grep ollama | grep -v grep
```

**預期結果**: 應該看到 `ollama serve` 進程

**如果沒有運行**:
```bash
launchctl load ~/Library/LaunchAgents/com.ollama.cors.plist
```

---

#### 2. 測試 Ollama API

```bash
curl http://localhost:11434/api/tags
```

**預期結果**: 應該回傳 JSON 格式的模型列表

**如果失敗**:
- 檢查 port 11434 是否被佔用：`lsof -i :11434`
- 重新啟動：`killall ollama && sleep 3 && launchctl load ~/Library/LaunchAgents/com.ollama.cors.plist`

---

#### 3. 檢查 CORS 設定

```bash
tail -50 /tmp/ollama-stderr.log | grep OLLAMA_ORIGINS
```

**預期結果**: 應該看到 `OLLAMA_ORIGINS:[* http://localhost ...]`

**如果沒有 OLLAMA_ORIGINS**:
1. 檢查 LaunchAgent 配置：
   ```bash
   cat ~/Library/LaunchAgents/com.ollama.cors.plist
   ```

2. 重新載入：
   ```bash
   launchctl unload ~/Library/LaunchAgents/com.ollama.cors.plist
   launchctl load ~/Library/LaunchAgents/com.ollama.cors.plist
   ```

---

#### 4. 測試 CORS（瀏覽器）

**選項 A - 使用 HTTP 伺服器** (推薦):

1. 啟動測試伺服器：
   ```bash
   cd ~/iris-immersive-translate
   python3 -m http.server 8080 &
   ```

2. 在瀏覽器打開：
   ```
   http://localhost:8080/test-cors-simple.html
   ```

3. 點擊「測試翻譯 API」

**選項 B - 使用 curl 模擬**:

```bash
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-oss:20b","prompt":"Hello","stream":false}'
```

---

#### 5. 檢查 Extension 權限

在 BrowserOS 中：

1. 前往 `chrome://extensions/`
2. 找到「Iris Immersive Translate」
3. 點擊「Details」
4. 確認以下權限已啟用：
   - ✅ Site access: On all sites
   - ✅ Allow access to file URLs (如果需要)

---

#### 6. 重新載入 Extension

在 BrowserOS 中：

1. 前往 `chrome://extensions/`
2. 找到「Iris Immersive Translate」
3. 點擊 **🔄 Reload**

---

#### 7. 檢查 Console 錯誤

在 BrowserOS 中：

1. 打開任何網頁
2. 按 `F12` 開啟 DevTools
3. 切換到 **Console** 標籤
4. 選取文字並按 `Alt+T`
5. 查看錯誤訊息

**常見錯誤**:

| 錯誤訊息 | 原因 | 解決方案 |
|----------|------|----------|
| `Failed to fetch` | Ollama 沒運行 | 啟動 Ollama |
| `403 Forbidden` | CORS 設定錯誤 | 重新載入 LaunchAgent |
| `Model not found` | 模型名稱錯誤 | 更新 Extension 設定 |
| `NetworkError` | 網路問題 | 檢查防火牆 |

---

## 常見解決方案

### 解決方案 1: 完全重置 Ollama

```bash
# 1. 停止所有 Ollama 進程
killall ollama
sleep 3

# 2. 卸載 LaunchAgent
launchctl unload ~/Library/LaunchAgents/com.ollama.cors.plist 2>/dev/null

# 3. 重新載入 LaunchAgent
launchctl load ~/Library/LaunchAgents/com.ollama.cors.plist

# 4. 驗證運行
sleep 5
ps aux | grep "ollama serve" | grep -v grep

# 5. 測試 API
curl http://localhost:11434/api/tags
```

### 解決方案 2: 檢查模型名稱

```bash
# 列出可用模型
ollama list

# 或使用 API
curl -s http://localhost:11434/api/tags | python3 -c "import sys, json; [print(m['name']) for m in json.load(sys.stdin)['models']]"
```

在 Extension 設定中使用正確的模型名稱（例如 `gpt-oss:20b`）。

### 解決方案 3: 清除 Extension 資料

在 BrowserOS 中：

1. 前往 `chrome://extensions/`
2. 點擊「Iris Immersive Translate」的「Remove」
3. 重新載入 Extension（Load unpacked）
4. 重新配置設定

---

## 手動測試流程

### 測試 1: API 連接

```bash
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-oss:20b",
    "prompt": "Translate \"Hello\" to Chinese",
    "stream": false
  }' | python3 -c "import sys, json; print(json.load(sys.stdin)['response'])"
```

**預期結果**: 應該輸出中文翻譯

### 測試 2: Extension Background Script

在 BrowserOS 中：

1. 前往 `chrome://extensions/`
2. 找到「Iris Immersive Translate」
3. 點擊「service worker」連結
4. 在 Console 輸入：
   ```javascript
   chrome.runtime.sendMessage({
     action: 'translate',
     text: 'Hello World'
   }, response => console.log(response));
   ```

**預期結果**: 應該看到翻譯結果

### 測試 3: Content Script

在 BrowserOS 中：

1. 打開任何網頁
2. 按 `F12`
3. 在 Console 輸入：
   ```javascript
   chrome.runtime.sendMessage({
     action: 'translate-selection'
   });
   ```

---

## 快速診斷腳本

執行診斷腳本：

```bash
cd ~/iris-immersive-translate
./diagnose.sh
```

這會自動檢查：
- ✅ Ollama 運行狀態
- ✅ API 可訪問性
- ✅ 可用模型
- ✅ Extension 檔案完整性
- ✅ 環境變數設定

---

## 仍然無法解決？

### 收集診斷資訊

執行以下命令並提供輸出：

```bash
# 1. Ollama 狀態
ps aux | grep ollama | grep -v grep

# 2. Ollama 日誌
tail -100 /tmp/ollama-stderr.log

# 3. 測試 API
curl -v http://localhost:11434/api/tags 2>&1 | head -50

# 4. LaunchAgent 狀態
launchctl list | grep ollama

# 5. Extension 設定
cat ~/Library/Application\ Support/Google/Chrome/Default/Preferences | grep -A20 "iris-immersive-translate" 2>/dev/null || echo "No Chrome config found"
```

---

## 聯絡支援

提供以下資訊：
- macOS 版本：`sw_vers`
- Ollama 版本：`ollama --version`
- 瀏覽器版本
- 錯誤訊息截圖
- Console 日誌

---

**最後更新**: 2025-11-01
