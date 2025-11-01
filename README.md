# 🌐 Iris Immersive Translate

**沉浸式翻譯 - 使用 Ollama 本地模型進行網頁翻譯**

一個強大的 Chrome Extension，利用 Ollama 本地 LLM 提供隱私保護的網頁翻譯功能。

---

## ✨ 特色功能

### 🔒 隱私優先
- ✅ **完全本地運行**：所有翻譯在你的電腦上進行
- ✅ **無數據上傳**：不會將任何內容發送到雲端
- ✅ **完全免費**：使用 Ollama 本地模型，無需 API 費用

### 🎯 翻譯方式
- **選取翻譯**：選擇文字後按 `Alt+T`（所有平台）
- **整頁翻譯**：按 `Alt+Shift+T` 翻譯整個網頁
- **雙語對照**：原文和譯文並排顯示，保持排版

### 🤖 AI 模型支援
- 支援所有 Ollama 模型
- 推薦模型：
  - `gpt-oss:20b` - GPT 開源模型，翻譯品質優異（預設）
  - `llama3.3` - Meta 最新模型，多語言支援強
  - `qwen2.5` - 阿里巴巴模型，中文翻譯出色
  - `gemma2` - Google 模型，快速且準確

### 🎨 美觀界面
- 現代化設計（漸層紫色主題）
- 流暢動畫效果
- 響應式設計（支援手機、平板）
- 可自訂樣式

---

## 📋 系統需求

### 必需
1. **Chrome / Chromium / BrowserOS**
   - Chrome 88 或更新版本
   - 支援 Manifest V3

2. **Ollama**
   - 安裝教學：https://ollama.ai
   - 至少下載一個模型（例如 `ollama pull llama3.3`）

### 推薦
- macOS / Linux / Windows
- 8GB+ RAM（運行本地模型）
- 網速不限（完全本地運行）

---

## 🚀 安裝步驟

### Step 1: 安裝 Ollama

```bash
# macOS
brew install ollama

# 或從官網下載
# https://ollama.ai/download
```

### Step 2: 下載模型

```bash
# 下載 GPT-OSS 20B（預設推薦）
ollama pull gpt-oss:20b

# 或其他模型
ollama pull llama3.3
ollama pull qwen2.5
ollama pull gemma2
```

### Step 3: 啟動 Ollama（允許跨域）⚠️ **重要**

為了讓 Chrome Extension 能夠訪問本地 Ollama API，必須設置 CORS：

**macOS (推薦使用 LaunchAgent):**
```bash
# 停止現有的 Ollama
killall ollama Ollama

# 創建 LaunchAgent
cat > ~/Library/LaunchAgents/com.ollama.cors.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.ollama.cors</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Applications/Ollama.app/Contents/Resources/ollama</string>
        <string>serve</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>OLLAMA_ORIGINS</key>
        <string>chrome-extension://*,http://localhost:*,https://localhost:*,file://*,*</string>
        <key>OLLAMA_HOST</key>
        <string>127.0.0.1:11434</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/ollama-stdout.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/ollama-stderr.log</string>
</dict>
</plist>
EOF

# 啟動服務
launchctl load ~/Library/LaunchAgents/com.ollama.cors.plist
```

**Linux:**
```bash
# 設置環境變量並啟動
OLLAMA_ORIGINS="chrome-extension://*,http://localhost:*,https://localhost:*,file://*,*" ollama serve
```

**Windows:**
```powershell
# 在系統環境變數中設定
$env:OLLAMA_ORIGINS="chrome-extension://*,http://localhost:*,https://localhost:*,file://*,*"
ollama serve
```

### Step 4: 安裝 Chrome Extension

1. 打開 Chrome，進入 `chrome://extensions/`
2. 開啟右上角的「開發者模式」
3. 點擊「載入未封裝項目」
4. 選擇 `iris-immersive-translate` 資料夾
5. 完成！Extension 已安裝

### Step 5: 配置設定

1. 點擊 Extension 圖標
2. 檢查設定：
   - **Ollama API 端點**: `http://localhost:11434`
   - **模型**: `gpt-oss:20b`（或你下載的模型）
   - **目標語言**: 選擇你想翻譯成的語言（預設：繁體中文）
3. 點擊「測試連線」確認運作正常
4. 點擊「儲存設定」

---

## 🎯 使用方法

### 方法 1: 選取翻譯

1. 在任何網頁上選取文字
2. 按 `Alt+T`（所有平台）
3. 翻譯結果會以工具提示框顯示在選取文字旁

### 方法 2: 整頁翻譯

1. 在任何網頁上按 `Alt+Shift+T`（所有平台）
2. 等待翻譯完成
3. 頁面會顯示雙語對照（原文在上 + 譯文在下）

### 取消翻譯

- 再次按 `Alt+Shift+T` 取消整頁翻譯

---

## 🔧 進階配置

### 自訂快捷鍵

1. 進入 `chrome://extensions/shortcuts`
2. 找到「Iris Immersive Translate」
3. 自訂你喜歡的快捷鍵

### 更換模型

不同模型有不同特性：

| 模型 | 優點 | 缺點 | 推薦用途 |
|------|------|------|----------|
| `gpt-oss:20b` | 品質優異，平衡性能 | 需要較多記憶體 | 通用翻譯（預設） |
| `llama3.3` | 多語言支援強 | 較大（4.7GB） | 專業翻譯 |
| `qwen2.5` | 中文翻譯出色 | 英文稍遜 | 中文內容 |
| `gemma2` | 快速，佔用少 | 品質中等 | 日常瀏覽 |

### 效能優化

```bash
# 如果翻譯速度慢，可以嘗試量化模型
ollama pull llama3.3:Q4_K_M  # 4-bit 量化，更快

# 或使用更小的模型
ollama pull llama3.3:1b  # 1B 參數版本
```

---

## 📂 專案結構

```
iris-immersive-translate/
├── manifest.json          # Extension 配置（Manifest V3）
├── background.js          # Service Worker（監聽快捷鍵、調用 Ollama）
├── content.js             # Content Script（翻譯邏輯、UI）
├── popup.html             # 設定介面
├── popup.js               # 設定邏輯
├── styles/
│   └── translate.css      # 翻譯樣式（雙語對照）
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## 🛠️ 開發

### 本地開發

```bash
# 克隆專案
cd ~/iris-immersive-translate

# 修改代碼後，在 chrome://extensions/ 點擊「重新載入」
```

### 調試

- **Background Script**: 在 Extension 詳細頁面點擊「Service Worker」
- **Content Script**: 在網頁上按 `F12` 打開 DevTools，查看 Console
- **Popup**: 右鍵點擊 Extension 圖標 → 檢查彈出式視窗

---

## 🤝 貢獻

歡迎貢獻！可以改進的方向：

- [ ] 支援更多翻譯模式（懸浮翻譯、即時翻譯）
- [ ] 支援 PDF 翻譯
- [ ] 支援影片字幕翻譯
- [ ] 增加翻譯歷史記錄
- [ ] 支援自訂提示詞（Prompt）
- [ ] 優化批次翻譯性能
- [ ] 支援其他 LLM API（OpenAI, Gemini 等）

---

## 📝 授權

MIT License

---

## 💡 靈感來源

本專案受到 [沉浸式翻譯](https://immersivetranslate.com/) 的啟發，致力於提供：
- ✅ 完全本地化的替代方案
- ✅ 更強的隱私保護
- ✅ 完全免費
- ✅ 可自訂的 AI 模型

---

## 🆘 常見問題

### Q: Ollama 連線失敗？
**A**: 確認：
1. Ollama 是否正在運行：`ollama list`
2. 是否設定跨域：`OLLAMA_ORIGINS="*" ollama serve`
3. 端點是否正確：`http://localhost:11434`

### Q: 翻譯速度很慢？
**A**:
1. 使用量化模型：`ollama pull llama3.3:Q4_K_M`
2. 使用更小的模型：`gemma2:2b`
3. 檢查 CPU/GPU 使用率

### Q: 翻譯品質不佳？
**A**:
1. 更換更大的模型：`llama3.3:70b`
2. 調整提示詞（修改 `background.js` 中的 prompt）
3. 使用專門的翻譯模型

### Q: 支援哪些瀏覽器？
**A**:
- ✅ Chrome 88+
- ✅ BrowserOS
- ✅ Edge（Chromium 版）
- ✅ Brave
- ⚠️ Firefox（需修改為 Manifest V2）

---

## 📧 聯絡

有問題或建議？歡迎聯絡：
- **GitHub**: [browseros-ai/iris-immersive-translate](https://github.com/browseros-ai/iris-immersive-translate)
- **Email**: 你的 Email

---

**Powered by Iris 🤖 | Built with ❤️ for Privacy**
