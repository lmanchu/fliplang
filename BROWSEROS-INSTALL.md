# 🌐 在 BrowserOS 中安裝 Iris Immersive Translate

## 前置準備

### 1. 確認 Ollama 正在運行

```bash
# 檢查 Ollama 是否運行
ps aux | grep ollama

# 如果沒有運行，啟動它（允許跨域）
OLLAMA_ORIGINS="*" ollama serve
```

**重要**: 必須設定 `OLLAMA_ORIGINS="*"` 才能讓 Extension 訪問 Ollama API。

### 2. 檢查模型

```bash
# 查看已安裝的模型
ollama list

# 如果沒有模型，下載一個
ollama pull llama3.3
```

---

## 安裝步驟

### Step 1: 打開 BrowserOS

1. 啟動 BrowserOS 應用程式
2. 等待完全載入

### Step 2: 進入 Extensions 頁面

在網址列輸入並前往：
```
chrome://extensions/
```

或者：
1. 點擊右上角的三個點 (⋮)
2. 選擇「Extensions」→「Manage Extensions」

### Step 3: 開啟開發者模式

在 Extensions 頁面：
1. 找到右上角的「Developer mode」開關
2. **打開**它（切換到藍色/開啟狀態）

這會顯示額外的按鈕：「Load unpacked」、「Pack extension」等。

### Step 4: 載入 Extension

1. 點擊「**Load unpacked**」按鈕
2. 在檔案選擇對話框中，導航到：
   ```
   /Users/lman/iris-immersive-translate
   ```
3. 點擊「**選取**」（Select）

### Step 5: 確認安裝

如果成功，你應該會看到：
- Extension 卡片出現在頁面上
- 標題：**Iris Immersive Translate**
- 版本：**1.0.0**
- 狀態：**Enabled**（已啟用）

**如果有錯誤**:
- 檢查圖標是否正確生成（icon16.png, icon48.png, icon128.png）
- 檢查 manifest.json 語法是否正確
- 查看錯誤訊息並修正

---

## 配置設定

### Step 6: 開啟設定介面

方法 1 - 點擊 Extension 圖標:
1. 在 BrowserOS 工具列找到 Extension 圖標（紫色地球）
2. 點擊它

方法 2 - 從 Extensions 頁面:
1. 在 Extension 卡片上點擊「Details」
2. 找到「Extension options」
3. 點擊它

### Step 7: 設定 Ollama

在設定頁面填寫：

1. **Ollama API 端點**:
   ```
   http://localhost:11434
   ```

2. **Ollama 模型**:
   ```
   llama3.3
   ```
   （或你下載的模型名稱，用 `ollama list` 查看）

3. **目標語言**:
   - 選擇「繁體中文」
   - 或其他你想翻譯成的語言

### Step 8: 測試連線

1. 點擊「**測試連線**」按鈕
2. 等待幾秒鐘

**成功**:
- 顯示「✓ 連線成功！模型 llama3.3 正常運作」

**失敗**:
- 檢查 Ollama 是否正在運行
- 檢查是否設定了 `OLLAMA_ORIGINS="*"`
- 檢查端點是否正確

### Step 9: 儲存設定

1. 點擊「**儲存設定**」按鈕
2. 看到「設定已儲存！」訊息

---

## 開始使用

### 測試 1: 選取翻譯

1. 打開任何英文網頁（例如 https://news.ycombinator.com）
2. **選取**一段英文文字
3. 按快捷鍵：
   - **Mac**: `Command + Shift + T`
   - **Windows**: `Ctrl + Shift + T`
4. 應該會看到翻譯彈出框

### 測試 2: 整頁翻譯

1. 在任何英文網頁上
2. 按快捷鍵：
   - **Mac**: `Command + Shift + P`
   - **Windows**: `Ctrl + Shift + P`
3. 右上角會顯示翻譯進度
4. 完成後，頁面會顯示雙語對照

### 取消翻譯

- 再次按 `Command/Ctrl + Shift + P` 可以取消整頁翻譯

---

## 自訂快捷鍵（可選）

如果你想更改快捷鍵：

1. 在網址列輸入並前往：
   ```
   chrome://extensions/shortcuts
   ```

2. 找到「Iris Immersive Translate」

3. 點擊鉛筆圖標 (✎) 編輯快捷鍵

4. 設定你喜歡的快捷鍵組合

---

## 疑難排解

### 問題 1: Extension 載入失敗

**可能原因**:
- 圖標檔案損壞或缺失
- manifest.json 語法錯誤

**解決方案**:
```bash
# 重新生成圖標
cd ~/iris-immersive-translate/icons
ls -lh icon*.png  # 確認檔案存在且大小合理

# 檢查 manifest.json
cd ~/iris-immersive-translate
cat manifest.json | python3 -m json.tool  # 驗證 JSON 語法
```

### 問題 2: 快捷鍵不工作

**可能原因**:
- 快捷鍵被其他 Extension 佔用
- BrowserOS 系統快捷鍵衝突

**解決方案**:
1. 進入 `chrome://extensions/shortcuts`
2. 檢查是否有衝突
3. 更改為其他快捷鍵組合

### 問題 3: 翻譯失敗

**可能原因**:
- Ollama 沒有運行
- CORS 錯誤（未設定 OLLAMA_ORIGINS）
- 模型不存在

**解決方案**:
```bash
# 1. 檢查 Ollama
ps aux | grep ollama

# 2. 重新啟動 Ollama（設定跨域）
killall ollama  # 如果正在運行
OLLAMA_ORIGINS="*" ollama serve

# 3. 檢查模型
ollama list

# 4. 測試 API
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.3",
  "prompt": "Hello",
  "stream": false
}'
```

### 問題 4: Console 錯誤

按 `F12` 打開 DevTools，查看 Console 標籤：

**常見錯誤**:
- `CORS error`: 未設定 OLLAMA_ORIGINS
- `Failed to fetch`: Ollama 沒有運行
- `Model not found`: 模型名稱錯誤或未下載

### 問題 5: 翻譯速度很慢

**解決方案**:

1. 使用量化模型（更快）:
   ```bash
   ollama pull llama3.3:Q4_K_M
   ```

2. 使用更小的模型:
   ```bash
   ollama pull gemma2:2b
   ```

3. 在 Extension 設定中更新模型名稱

---

## 進階配置

### 永久設定 OLLAMA_ORIGINS

**macOS (zsh)**:
```bash
echo 'export OLLAMA_ORIGINS="*"' >> ~/.zshrc
source ~/.zshrc
```

**macOS (bash)**:
```bash
echo 'export OLLAMA_ORIGINS="*"' >> ~/.bash_profile
source ~/.bash_profile
```

### 使用 LaunchAgent 自動啟動 Ollama

創建檔案 `~/Library/LaunchAgents/com.ollama.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/ollama</string>
        <string>serve</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>OLLAMA_ORIGINS</key>
        <string>*</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

載入：
```bash
launchctl load ~/Library/LaunchAgents/com.ollama.plist
```

---

## 除錯技巧

### 查看 Background Script 日誌

1. 進入 `chrome://extensions/`
2. 找到「Iris Immersive Translate」
3. 點擊「service worker」連結
4. 查看 Console 輸出

### 查看 Content Script 日誌

1. 在任何網頁上按 `F12`
2. 切換到「Console」標籤
3. 查找 `[Iris Translate]` 或 `[Content]` 開頭的訊息

### 清除 Extension 資料

如果設定出錯，可以清除：

1. 進入 `chrome://extensions/`
2. 點擊「Iris Immersive Translate」的「Remove」
3. 重新載入 Extension
4. 重新配置設定

---

## 效能優化建議

### 1. 選擇合適的模型

| 模型 | 大小 | 速度 | 品質 | 推薦場景 |
|------|------|------|------|----------|
| llama3.3:1b | 1.3GB | ⚡⚡⚡ | ⭐⭐ | 快速瀏覽 |
| gemma2:2b | 1.6GB | ⚡⚡⚡ | ⭐⭐⭐ | 日常使用 |
| llama3.3 | 4.7GB | ⚡⚡ | ⭐⭐⭐⭐ | 高品質翻譯 |
| qwen2.5 | 4.7GB | ⚡⚡ | ⭐⭐⭐⭐⭐ | 中文內容 |
| llama3.3:70b | 40GB | ⚡ | ⭐⭐⭐⭐⭐ | 專業翻譯 |

### 2. 使用量化版本

```bash
# 4-bit 量化（推薦）
ollama pull llama3.3:Q4_K_M

# 8-bit 量化（品質更好）
ollama pull llama3.3:Q8_0
```

### 3. 只翻譯需要的部分

- 使用選取翻譯而非整頁翻譯
- 整頁翻譯時會自動跳過短文本和數字

---

## 成功安裝的標誌

✅ Extension 出現在 `chrome://extensions/`
✅ 測試連線成功
✅ 選取翻譯可以正常工作
✅ 整頁翻譯可以正常工作
✅ 設定可以儲存

---

## 享受翻譯！

現在你可以：
- 📖 閱讀任何語言的網頁（雙語對照）
- 🔒 完全隱私保護（不上傳任何資料）
- 💰 完全免費（使用本地模型）
- ⚡ 自訂模型和語言

**快捷鍵提醒**:
- `Cmd/Ctrl + Shift + T`: 翻譯選取文字
- `Cmd/Ctrl + Shift + P`: 翻譯整頁 / 取消翻譯

Happy Translating! 🌐✨
