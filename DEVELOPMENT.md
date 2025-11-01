# 🛠️ Development Log & Planning

## 開發日誌

### 2025-11-01 - v1.0.0 Initial Release

#### 完成的工作
- ✅ 設計並實現 Chrome Extension 架構（Manifest V3）
- ✅ 整合 Ollama 本地 AI API
- ✅ 實現選取翻譯功能（Alt+T）
- ✅ 實現整頁翻譯功能（Alt+Shift+T）
- ✅ 設計雙語並排顯示 UI
- ✅ 創建設定介面（popup.html）
- ✅ 解決 CORS 跨域問題
- ✅ 撰寫完整文檔
- ✅ 發布到 GitHub
- ✅ 創建 v1.0.0 Release

#### 遇到的挑戰
1. **CORS 403 錯誤**
   - 問題：Chrome Extension 無法訪問 Ollama API
   - 解決：配置 OLLAMA_ORIGINS 環境變量，包含 chrome-extension://*
   - 方案：使用 macOS LaunchAgent 持久化配置

2. **快捷鍵衝突**
   - 問題：Cmd+Shift+T 與 BrowserOS 衝突
   - 解決：改用 Alt+T 和 Alt+Shift+T

3. **模型選擇**
   - 問題：用戶可能沒有預設模型
   - 解決：改為 gpt-oss:20b，並支援所有模型

#### 技術決策
- **為什麼選擇 Manifest V3？** Chrome 未來方向，更安全
- **為什麼用 Service Worker？** Manifest V3 要求，取代 background pages
- **為什麼不用框架？** 保持輕量，無需構建過程
- **為什麼選 Ollama？** 完全本地，隱私保護，免費

#### 性能數據
- Extension 大小：~50KB
- 記憶體使用：~10MB
- 翻譯速度：2-15 秒（取決於文字長度和模型）

---

## 🎯 未來開發計劃

### v1.1.0 (預計 2-3 週)

#### 新功能
- [ ] **懸浮翻譯提示框**
  - 鼠標懸停自動顯示翻譯
  - 可配置延遲時間
  - 支援關閉/開啟

- [ ] **翻譯歷史記錄**
  - 保存最近 50 條翻譯
  - 可搜尋歷史
  - 一鍵清除

- [ ] **自訂快捷鍵**
  - UI 介面設定快捷鍵
  - 不需要進入 chrome://extensions/shortcuts

#### 改進
- [ ] 優化 UI 動畫效果
- [ ] 添加翻譯進度指示
- [ ] 改善錯誤提示訊息
- [ ] 支援更多目標語言

#### 文檔
- [ ] 添加截圖和 GIF
- [ ] 英文版 README
- [ ] 影片教學

---

### v1.2.0 (預計 1-2 個月)

#### 主要功能
- [ ] **PDF 翻譯支援**
  - 提取 PDF 文字
  - 保持格式
  - 匯出翻譯後的 PDF

- [ ] **批次翻譯優化**
  - 並行處理多個段落
  - 智能分段
  - 減少 API 調用次數

- [ ] **自訂提示詞（Prompt）**
  - UI 介面編輯 prompt
  - 預設多個 prompt 模板
  - 針對不同內容類型優化

#### 技術改進
- [ ] 加入翻譯快取機制
- [ ] 支援離線模式
- [ ] 優化記憶體使用

---

### v2.0.0 (預計 3-6 個月)

#### 重大更新
- [ ] **多 LLM API 支援**
  - OpenAI GPT API
  - Google Gemini API
  - Anthropic Claude API
  - 本地和雲端混合模式

- [ ] **進階翻譯模式**
  - 專業翻譯（法律、醫療等）
  - 文學翻譯
  - 技術文檔翻譯

- [ ] **跨瀏覽器支援**
  - Firefox (Manifest V2)
  - Safari
  - Edge (原生支援)

#### 社群功能
- [ ] 分享翻譯模板
- [ ] 社群貢獻的 prompt
- [ ] 翻譯品質評分

---

## 🐛 Known Issues & Bugs

### v1.0.0
目前無已知問題。

### 待觀察
- 某些網站的 DOM 結構可能導致翻譯失敗
- 大量文字翻譯可能導致記憶體增加
- 某些特殊字符可能無法正確處理

---

## 🔬 實驗性功能

### 正在研究
- [ ] **即時協作翻譯**
  - 多人同時翻譯同一頁面
  - 分享翻譯結果

- [ ] **影片字幕翻譯**
  - YouTube 字幕即時翻譯
  - 支援其他影片平台

- [ ] **語音輸入/輸出**
  - 語音轉文字再翻譯
  - 翻譯結果語音播放

---

## 📊 開發優先級

### High Priority (v1.1.0)
1. 懸浮翻譯提示框
2. 翻譯歷史記錄
3. 添加截圖到 README

### Medium Priority (v1.2.0)
1. PDF 翻譯支援
2. 批次翻譯優化
3. 英文文檔

### Low Priority (v2.0.0+)
1. 多 LLM API 支援
2. 跨瀏覽器支援
3. 社群功能

---

## 🤝 貢獻指南

### 如何貢獻
1. Fork repository
2. 創建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 開啟 Pull Request

### 代碼規範
- 使用 2 空格縮排
- 函數和變數使用 camelCase
- 添加註釋說明複雜邏輯
- 遵循現有代碼風格

### 測試
- 在多個網站測試翻譯功能
- 測試不同的 Ollama 模型
- 確保 CORS 配置正確
- 檢查控制台無錯誤訊息

---

## 📚 學習資源

### Chrome Extension 開發
- [Chrome Extension Manifest V3 文檔](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Extension API 參考](https://developer.chrome.com/docs/extensions/reference/)

### Ollama
- [Ollama 官方文檔](https://github.com/ollama/ollama)
- [Ollama API 文檔](https://github.com/ollama/ollama/blob/main/docs/api.md)

### 翻譯技術
- [TreeWalker API](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker)
- [Web Translation API](https://developer.mozilla.org/en-US/docs/Web/API/Translation)

---

## 💡 創意想法（未來可能實現）

- 支援圖片 OCR 翻譯
- AI 總結長文章
- 多語言對照（同時顯示 3+ 語言）
- 翻譯品質評分和建議
- 學習模式（雙語學習卡片）
- 與筆記軟體整合（Notion, Obsidian）
- 瀏覽器側邊欄模式
- Dark mode 支援
- 自訂主題顏色

---

## 📝 開發筆記

### 性能優化建議
- 考慮使用 Web Workers 處理大量文字
- 實現智能快取減少重複翻譯
- 優化 DOM 操作，減少重排重繪
- 使用 IntersectionObserver 延遲加載翻譯

### 安全性考量
- 不存儲用戶翻譯內容（隱私）
- 本地處理，不上傳到雲端
- 定期更新依賴（雖然目前無外部依賴）
- 遵循 Chrome Extension 安全最佳實踐

---

**Last Updated:** 2025-11-01
**Next Review:** 準備 v1.1.0 開發時
