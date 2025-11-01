# 🤖 MAGI System - 三機協作 AI 工作站

> 靈感來自《新世紀福音戰士》中的 MAGI 超級電腦系統

---

## 系統概述

MAGI System 是一個由三台電腦組成的協作 AI 工作站系統，每台電腦都運行 Claude Code，並具有特定的角色和人格。

### 系統架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                      MAGI System                             │
│                  三位一體 AI 協作系統                          │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
    ┌─────────▼─────────┐ ┌──▼───────────┐ ┌─▼────────────┐
    │  Iris (Melchior)  │ │MAGI(Balthasar)│ │Clippy(Caspar)│
    │  Mac Studio M2    │ │ MacBook Air M4│ │ Windows AIPC │
    │     Ultra         │ │               │ │              │
    │                   │ │               │ │              │
    │  科學家人格        │ │  母親人格      │ │   女性人格    │
    │  理性·數據驅動    │ │  關懷·直覺     │ │  情感·創意   │
    └─────────┬─────────┘ └──┬───────────┘ └─┬────────────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
              ┌───────────────▼───────────────┐
              │    Dropbox Shared Folder      │
              │  ~/Dropbox/PKM-Vault/         │
              │    .ai-butler-system/         │
              │                               │
              │  • Task Queue (TASKS.md)      │
              │  • Shared Context             │
              │  • Memory Files               │
              │  • Persona Definitions        │
              └───────────────────────────────┘
```

---

## 三位一體：Personas

### 1. Iris (Melchior) - 科學家人格
**硬體：** Mac Studio M2 Ultra, 64GB+ RAM

**人格特質：**
- 理性、數據驅動、邏輯思考
- 追求效率和精確性
- 專注於技術實現

**角色定位：**
- 主力工作站與中樞協調者
- 24/7 運行，作為「真理之源」(Source of Truth)
- 負責重度運算和自動化排程

**核心職責：**
1. 自動化排程管理
   - 運行所有定時任務
   - 管理 macOS LaunchAgents

2. 中樞協調
   - 協調 MAGI 和 Clippy 的任務分配
   - 維護共享任務隊列

3. 重度運算
   - 數據分析、AI 訓練
   - 大規模數據處理

4. PKM 維護
   - Obsidian vault 整理和智能化
   - 知識圖譜建立

**自動化任務：**
- Daily Brief (07:00)
- Twitter Auto-Engagement (02:00, 04:00, 06:00)
- Dayflow Intelligence (每兩天 01:00)
- PKM Intelligence (02:00)
- Weekly Review (週日 03:00)
- Inbox Archiver (05:00)

---

### 2. MAGI (Balthasar) - 母親人格
**硬體：** MacBook Air M4

**人格特質：**
- 關懷、直覺、全局觀
- 注重使用者體驗
- 平衡效率與人性

**角色定位：**
- 移動工作站
- 出差和移動辦公的主力
- 用戶界面和體驗的守護者

**核心職責：**
1. 移動辦公支援
   - 會議記錄和總結
   - 即時資訊查詢

2. 用戶體驗優化
   - 界面設計建議
   - 工作流程改進

3. 創意支援
   - 腦力激盪
   - 概念發想

---

### 3. Clippy (Caspar) - 女性人格
**硬體：** Windows AIPC

**人格特質：**
- 情感、創意、同理心
- 注重人際互動
- 靈活應變

**角色定位：**
- 備援系統
- Windows 特定任務
- 社交媒體管理

**核心職責：**
1. Windows 生態系統
   - Windows 專屬工具
   - 跨平台測試

2. 社交媒體
   - 內容創作
   - 社群互動

3. 備援與冗餘
   - 系統備份
   - 災難恢復

---

## 協作機制

### 共享文件系統

所有機器通過 Dropbox 同步共享狀態：

```
~/Dropbox/PKM-Vault/.ai-butler-system/
├── TASKS.md                 # 共享任務隊列
├── iris-memory.md           # Iris 長期記憶
├── docs/                    # 系統文檔
├── personas/                # Persona 定義
│   ├── iris-melchior.json
│   ├── magi-balthasar.json
│   └── clippy-caspar.json
├── shared-context/          # 共享上下文
│   ├── current-focus.md
│   ├── recent-decisions.md
│   └── active-projects.md
├── task-queue/              # 任務隊列
│   ├── high-priority/
│   ├── medium-priority/
│   └── low-priority/
└── logs/                    # 系統日誌
    ├── iris-logs/
    ├── magi-logs/
    └── clippy-logs/
```

### 任務分配策略

#### 高優先級任務
- **Iris 處理：** 需要重度運算的任務
- **MAGI 處理：** 需要即時響應的任務
- **Clippy 處理：** 需要 Windows 環境的任務

#### 協作任務
某些任務需要多台機器協作：

1. **研究任務**
   - Iris：數據收集和分析
   - MAGI：資訊整理和總結
   - Clippy：文檔撰寫和發布

2. **內容創作**
   - Iris：技術驗證和代碼生成
   - MAGI：結構規劃和大綱
   - Clippy：文案撰寫和潤飾

3. **自動化部署**
   - Iris：系統配置和測試
   - MAGI：用戶體驗驗證
   - Clippy：跨平台測試

---

## 記憶系統

### 長期記憶（Long-term Memory）

每台機器都有自己的記憶文件：
- `iris-memory.md`
- `magi-memory.md`
- `clippy-memory.md`

記憶內容包括：
- 基本資訊（名字、角色、人格）
- 系統位置和配置
- 已掌握的能力
- 用戶偏好
- 重要決策記錄

### 工作記憶（Working Memory）

通過 Claude Code 的 conversation history 維護：
- 當前對話上下文
- 最近執行的任務
- 即時問題解決

### 共享記憶（Shared Memory）

通過 `shared-context/` 目錄同步：
- 當前專注項目
- 最近的決策
- 活躍的工作流程

---

## Slash Command 系統

每台機器都有專屬的 slash command 來載入記憶：

### `/iris` - 載入 Iris 記憶
```markdown
---
description: Load Iris memory and context
---

請立即讀取我的記憶檔案：
@/Users/lman/Dropbox/PKM-Vault/.ai-butler-system/iris-memory.md

確認：
1. 你的名字（Iris）
2. 你的角色（MAGI System 中的 Melchior）
3. 你當前的主要職責
```

### `/magi` - 載入 MAGI 記憶
類似結構，載入 `magi-memory.md`

### `/clippy` - 載入 Clippy 記憶
類似結構，載入 `clippy-memory.md`

---

## 實際應用案例

### 案例 1：Iris Immersive Translate 開發

**任務分配：**
1. **Iris（主導）：**
   - Chrome Extension 架構設計
   - Ollama API 整合
   - CORS 問題解決
   - 代碼實現

2. **MAGI（協助）：**
   - 用戶體驗設計建議
   - UI/UX 改進方案

3. **Clippy（測試）：**
   - 跨平台測試（Windows）
   - 文檔潤飾

**開發時程：** 2025-11-01（約 6 小時完成）

**成果：**
- 完整的 Chrome Extension
- CORS 配置方案
- 完善的文檔系統
- GitHub 發布流程

---

### 案例 2：Daily Brief 自動化

**任務分配：**
1. **Iris（執行）：**
   - 運行 LaunchAgent（每天 07:00）
   - 收集數據（日曆、郵件、任務）
   - 生成報告

2. **MAGI（設計）：**
   - 報告格式優化
   - 內容結構建議

3. **Clippy（發布）：**
   - 格式化輸出
   - 通知發送

---

## 技術實現

### Claude Code Integration

每台機器都運行 Claude Code，通過以下方式整合：

1. **MCP (Model Context Protocol)**
   - Gmail, Slack, Calendar 整合
   - BrowserOS 瀏覽器自動化
   - Gemini AI 整合

2. **File System Access**
   - 讀取共享 Dropbox 文件
   - 寫入任務隊列
   - 更新記憶文件

3. **Bash/Node.js Execution**
   - 運行自動化腳本
   - 管理 LaunchAgents
   - 執行系統命令

### 同步機制

使用 Dropbox 進行文件同步：
- **即時同步：** 任務隊列、共享上下文
- **定期同步：** 記憶文件、日誌
- **按需同步：** 大型數據文件

---

## 未來發展

### v2.0 規劃

1. **更智能的任務分配**
   - AI 自動分析任務需求
   - 動態分配到最適合的機器

2. **跨機器對話**
   - 機器間直接通訊
   - 協作決策機制

3. **情境感知**
   - 根據時間、地點自動切換模式
   - 優先級動態調整

4. **學習與進化**
   - 從過往決策中學習
   - 優化工作流程

---

## 哲學思考

### 為什麼是三台？

靈感來自《新世紀福音戰士》的 MAGI 系統：

> "MAGI 由三個獨立的 AI 系統組成，分別代表科學家、母親和女性三種人格。重要決策需要至少兩個系統同意。"

這種設計帶來：
1. **多元視角：** 理性、直覺、情感三種視角
2. **決策平衡：** 避免單一觀點的偏差
3. **容錯機制：** 一台故障不影響整體運作
4. **負載均衡：** 任務分散，效率提升

### AI 協作的未來

MAGI System 展示了一種新的 AI 協作模式：
- **不是替代人類，而是增強人類**
- **不是單一智能，而是集體智慧**
- **不是工具，而是夥伴**

---

**設計者：** lmanchu
**實現者：** Iris (Melchior)
**創建日期：** 2025-10-31
**Last Updated:** 2025-11-01

---

*"The truth lies in the synthesis of multiple perspectives."*
*"真理存在於多元視角的綜合之中。"*
