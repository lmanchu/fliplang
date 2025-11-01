# 🚀 快速安裝指南

## 前置準備

### 1. 安裝 Ollama

```bash
# macOS（推薦使用 Homebrew）
brew install ollama

# 或從官網下載
open https://ollama.ai/download
```

### 2. 下載 AI 模型

```bash
# 推薦：Llama 3.3（4.7GB）
ollama pull llama3.3

# 備選：Qwen 2.5（中文翻譯優秀）
ollama pull qwen2.5

# 輕量級：Gemma 2（2.6GB）
ollama pull gemma2
```

### 3. 啟動 Ollama（允許跨域訪問）

**macOS / Linux:**
```bash
OLLAMA_ORIGINS="*" ollama serve
```

**永久設定（推薦）:**
```bash
# macOS
echo 'export OLLAMA_ORIGINS="*"' >> ~/.zshrc
source ~/.zshrc
ollama serve

# 或使用 launchctl
launchctl setenv OLLAMA_ORIGINS "*"
```

**Windows:**
1. 開啟「系統」→「進階系統設定」→「環境變數」
2. 新增使用者變數：
   - 變數名稱：`OLLAMA_ORIGINS`
   - 變數值：`*`
3. 重新啟動 Ollama

### 4. 驗證 Ollama 運作

```bash
# 測試 API
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.3",
  "prompt": "Hello",
  "stream": false
}'

# 應該會回傳 JSON 格式的回應
```

---

## 安裝 Extension

### Step 1: 準備圖標檔案

由於目前圖標是佔位符，你需要創建實際的 PNG 圖標：

**選項 A - 使用線上工具:**
1. 打開 `icons/icon.svg`
2. 上傳到 https://www.aconvert.com/image/svg-to-png/
3. 轉換成 16x16, 48x48, 128x128 三種尺寸
4. 下載並重命名為 `icon16.png`, `icon48.png`, `icon128.png`

**選項 B - 使用 macOS 命令行:**
```bash
cd ~/iris-immersive-translate/icons

# 需要安裝 ImageMagick
brew install imagemagick

# 轉換 SVG 到 PNG
for size in 16 48 128; do
  convert icon.svg -resize ${size}x${size} icon${size}.png
done
```

### Step 2: 載入到 Chrome

1. 打開 Chrome 瀏覽器
2. 在網址列輸入：`chrome://extensions/`
3. 開啟右上角的「開發者模式」
4. 點擊「載入未封裝項目」
5. 選擇 `/Users/lman/iris-immersive-translate` 資料夾
6. 點擊「選取」

### Step 3: 配置設定

1. 點擊 Extension 圖標（或在 Extension 列表中點擊「詳細資料」→「Extension 選項」）
2. 設定：
   - **Ollama API 端點**: `http://localhost:11434`
   - **模型**: `llama3.3`
   - **目標語言**: `繁體中文`（或你想要的語言）
3. 點擊「測試連線」
   - 如果成功，會顯示「✓ 連線成功！模型 llama3.3 正常運作」
   - 如果失敗，請檢查 Ollama 是否運行、跨域設定是否正確
4. 點擊「儲存設定」

---

## 測試使用

### 測試 1: 選取翻譯

1. 打開任何英文網頁（例如 https://news.ycombinator.com）
2. 選取一段英文文字
3. 按 `Cmd+Shift+T`（Mac）或 `Ctrl+Shift+T`（Windows）
4. 應該會看到翻譯彈出框

### 測試 2: 整頁翻譯

1. 打開任何英文網頁
2. 按 `Cmd+Shift+P`（Mac）或 `Ctrl+Shift+P`（Windows）
3. 等待翻譯完成（右上角會顯示進度）
4. 頁面會顯示雙語對照

### 取消翻譯

- 再次按 `Cmd+Shift+P` 可以取消整頁翻譯，恢復原文

---

## 在 BrowserOS 中安裝

BrowserOS 是基於 Chromium 的瀏覽器，安裝步驟相同：

1. 打開 BrowserOS
2. 進入 `chrome://extensions/`
3. 按照上述步驟載入 Extension

**優勢:**
- BrowserOS 內建 AI 功能，與翻譯 Extension 完美搭配
- 可以透過 MCP 控制翻譯流程

---

## 疑難排解

### 問題 1: 找不到 Ollama

**症狀**: 測試連線失敗，顯示「連線失敗」

**解決方案**:
```bash
# 檢查 Ollama 是否運行
ps aux | grep ollama

# 如果沒有運行，啟動它
OLLAMA_ORIGINS="*" ollama serve

# 檢查端點
curl http://localhost:11434/api/tags
```

### 問題 2: 跨域錯誤

**症狀**: Console 顯示 CORS 錯誤

**解決方案**:
```bash
# 確保設定了 OLLAMA_ORIGINS
echo $OLLAMA_ORIGINS  # 應該輸出 "*"

# 如果沒有，設定它
export OLLAMA_ORIGINS="*"
ollama serve
```

### 問題 3: 模型未找到

**症狀**: 翻譯失敗，顯示「模型 xxx 不存在」

**解決方案**:
```bash
# 查看已安裝的模型
ollama list

# 下載需要的模型
ollama pull llama3.3
```

### 問題 4: 快捷鍵不工作

**症狀**: 按快捷鍵沒有反應

**解決方案**:
1. 進入 `chrome://extensions/shortcuts`
2. 找到「Iris Immersive Translate」
3. 檢查快捷鍵是否被其他 Extension 佔用
4. 重新設定快捷鍵

### 問題 5: 翻譯速度很慢

**症狀**: 翻譯需要等很久

**解決方案**:
```bash
# 使用量化模型（更快）
ollama pull llama3.3:Q4_K_M

# 或使用更小的模型
ollama pull gemma2:2b

# 在 Extension 設定中更新模型名稱
```

---

## 完成！

現在你已經成功安裝了 Iris Immersive Translate！

**快捷鍵提醒**:
- `Cmd/Ctrl + Shift + T`: 翻譯選取文字
- `Cmd/Ctrl + Shift + P`: 翻譯整頁 / 取消翻譯

享受隱私、免費、高品質的網頁翻譯體驗！🎉
