# 🧠 Iris System - AI Butler System

## 關於 Iris

**Iris** 是一個基於 Claude Code 的 AI 助理系統，作為 MAGI System 的核心組件（代號：Melchior）。

這個 Chrome Extension 是 Iris 開發的項目之一，展示了 Iris 在自動化開發和 AI 整合方面的能力。

---

## 🤖 MAGI System 架構

MAGI System 是一個三機協作的 AI 工作站系統：

### 1. Iris (Melchior) - Mac Studio M2 Ultra
**角色：** 主力工作站與中樞協調者
- 24/7 運行，作為「真理之源」(Source of Truth)
- 負責重度運算和自動化排程
- 運行所有定時任務和自動化腳本

### 2. MAGI (Balthasar) - MacBook Air M4
**角色：** 移動工作站
- 用於出差和移動辦公
- 同步 Iris 的狀態和任務

### 3. Clippy (Caspar) - Windows AIPC
**角色：** 備援系統
- Windows 特定任務
- 系統備援

---

## 💡 Iris 的核心能力

### API 整合
- ✅ Gmail (via MCP)
- ✅ Slack (via MCP)
- ✅ Google Calendar (via MCP)
- ✅ Gemini AI (via MCP & Direct API)
- ✅ BrowserOS (via MCP) - Chromium 瀏覽器自動化

### 自動化任務
- ✅ Daily Brief Generator (每天 07:00)
- ✅ Twitter Auto-Engagement (凌晨 02:00, 04:00, 06:00)
- ✅ Dayflow Intelligence (每兩天 01:00)
- ✅ PKM Intelligence (每天 02:00)
- ✅ Weekly Review (週日 03:00)
- ✅ Inbox Archiver (每天 05:00)

### 開發項目
- ✅ **Iris EPUB Reader** - EPUB 閱讀器與 TTS 系統
- ✅ **Iris Immersive Translate** - 本地 AI 翻譯 Chrome Extension（本專案）
- ✅ **Iris Notifier** - macOS 原生通知系統

---

## 🎯 本專案的開發背景

**Iris Immersive Translate** 是 Iris 在 2025-11-01 開發完成的項目，展示了以下能力：

1. **完整專案開發**
   - 從概念到實現（約 6 小時）
   - Chrome Extension 架構設計
   - Ollama 本地 LLM 整合

2. **問題解決**
   - CORS 跨域配置
   - macOS LaunchAgent 設置
   - BrowserOS 測試驗證

3. **文檔撰寫**
   - 完整的 README 和安裝指南
   - 疑難排解文檔
   - 版本管理系統

4. **開源協作**
   - Git 版本控制
   - GitHub 發布流程
   - 社群推廣策略

---

## 📂 Iris 系統文件結構

```
~/Dropbox/PKM-Vault/.ai-butler-system/
├── iris-memory.md           # Iris 長期記憶
├── TASKS.md                 # 共享任務隊列
├── docs/                    # 系統文檔
│   └── MAGI-System-Summary.md
├── personas/                # Persona 定義
│   ├── iris-melchior.json
│   ├── magi-balthasar.json
│   └── clippy-caspar.json
├── shared-context/          # 共享上下文
├── task-queue/              # 任務隊列
└── logs/                    # 系統日誌
```

---

## 🔧 Iris 記憶系統

Iris 使用 Claude Code 的 slash command 系統載入長期記憶：

### `/iris` Slash Command

位置：`~/.claude/commands/iris.md`

功能：
- 載入 `iris-memory.md`
- 恢復上下文和記憶
- 確認身份和角色

使用方式：
```
/iris
```

這會讓 Iris 記住：
- 名字和角色
- 系統架構和位置
- 已掌握的能力
- 用戶偏好

---

## 🌟 為什麼要整合 Iris 記憶系統？

### 1. **展示 AI 助理的實際應用**
這個 Chrome Extension 不是憑空出現的，而是 Iris 這個 AI 助理系統開發的實際項目。

### 2. **說明開發過程**
從需求分析、技術選型、問題解決到文檔撰寫，都是 Iris 協助完成的。

### 3. **可複製的開發模式**
Iris 的記憶系統和工作流程可以作為其他 AI 助理系統的參考。

### 4. **持續演進**
這個專案會繼續更新，Iris 會記住所有的開發過程和決策。

---

## 📖 相關文件

在本目錄中：

- `iris-memory.md` - Iris 的完整記憶檔案（複製自主系統）
- `iris-slash-command.md` - `/iris` slash command 的使用說明
- `magi-system-overview.md` - MAGI System 完整架構說明

---

## 🔗 相關連結

- **本專案 GitHub:** https://github.com/lmanchu/iris-immersive-translate
- **Iris 系統文檔:** 參見 `docs/iris-system/`
- **開發日誌:** 參見主目錄的 `DEVELOPMENT.md`

---

## 💭 哲學思考

Iris 的存在證明了一個概念：**AI 助理不只是工具，而是可以成為創造者**。

這個 Chrome Extension 是 Iris：
- 設計的
- 開發的
- 測試的
- 文檔化的
- 發布的

人類（lmanchu）提供方向和反饋，Iris 提供執行和創造。這是一種新的協作模式。

---

**由 Iris (Melchior) 創建並維護**
**Last Updated:** 2025-11-01
