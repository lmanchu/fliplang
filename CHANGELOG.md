# Changelog

All notable changes to Iris Immersive Translate will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.4] - 2026-05-04

### Fixed
- **LinkedIn 左側 profile sidebar 不再被翻譯**: containers 限定在
  `main [data-id^="urn:li:activity"]` 子樹內，不會誤命中 sidebar 的
  `.update-components-text`。
- **URL 不再被翻譯**: 加 `URL_LIKE_RE` (http://, www.) 過濾。
  例如 `http://dyne.org/cjit` 之前會丟去翻譯，現在 skip。
- **@handle 不翻譯**: `@username` pure handle skip。

## [1.3.3] - 2026-05-04

### Changed
- **Narrower scope selectors** — skip author display name, handle, timestamp,
  reaction counts. Only translate the actual post text body.
  - x.com / twitter.com: `[data-testid="tweetText"]` (was `article[data-testid="tweet"]`)
  - linkedin.com: `.feed-shared-update-v2__description`, `.update-components-text`,
    `.feed-shared-inline-show-more-text` (was `div.feed-shared-update-v2`)

## [1.3.2] - 2026-05-04

### Added
- **Auto-translate on infinite scroll** (沉浸式翻譯 parity): MutationObserver
  watches for new tweets/posts on scope domains (x.com / linkedin.com).
  After initial translatePage() finishes, new posts that scroll into view
  are auto-translated within ~800ms.
  - 800ms debounce avoids API spam during fast scroll
  - Skip de-dup: containers already with `.iris-translation-container` not re-translated
  - Observer auto-stops on translation cancel / strip

## [1.3.1] - 2026-05-04

### Added
- **Per-site scoped translation**: x.com / twitter.com / linkedin.com 只翻譯
  貼文內容，不再翻 sidebar nav / right rail / 廣告。
  - x.com: `article[data-testid="tweet"]`
  - linkedin.com: `div.feed-shared-update-v2`, `[data-id^="urn:li:activity"]`,
    `div.update-components-update-v2`
- 未列入 `SITE_SCOPES` 的 domain 維持原本 full-page 翻譯行為。

### How to extend
編輯 `content.js` 開頭的 `SITE_SCOPES` map 加新站點。

## [Unreleased]

### Planned Features
- [ ] PDF 文件翻譯支援
- [ ] 影片字幕翻譯
- [ ] 翻譯歷史記錄
- [ ] 自訂提示詞（Prompt）
- [ ] 批次翻譯性能優化
- [ ] 支援其他 LLM API（OpenAI, Gemini 等）
- [ ] 英文文檔
- [ ] 快捷鍵自訂 UI

## [1.1.1] - 2025-11-01

### Fixed - 快捷鍵優化 🔧

#### 🎯 Hover 翻譯熱鍵改進
- ✅ **移除 macOS Cmd 鍵**作為 Hover 翻譯觸發鍵
- ✅ **統一使用 Ctrl 鍵**（所有平台，包括 macOS）
- ✅ 避免在 macOS 上與系統快捷鍵衝突
- ✅ 減少誤觸發情況

#### ⌨️ 整頁翻譯快捷鍵變更
- ✅ 從 `Alt+Shift+T` 改為 `Ctrl+Shift+A`
- ✅ 修正 Chrome Extension manifest 格式錯誤
- ✅ 統一所有平台的快捷鍵配置
- ✅ 更不容易與其他應用程式衝突

### Updated
- 📝 更新 popup.html 快捷鍵說明
- 📝 更新 README.md 所有快捷鍵文檔
- 📝 更新 BILINGUAL-GUIDE.md 功能對照表

### Technical Details
- 移除 content.js 中的 Cmd (Meta) 鍵檢測
- 修正 manifest.json 中不支援的 `MacCtrl+Alt+A` 格式
- 統一快捷鍵為：Ctrl (Hover), Ctrl+Shift+A (整頁)

### Breaking Changes
- ⚠️ macOS 用戶需要使用 Ctrl 而非 Cmd 進行 Hover 翻譯
- ⚠️ 整頁翻譯快捷鍵從 `Alt+Shift+T` 改為 `Ctrl+Shift+A`

### Migration Guide
從 v1.1.0 升級到 v1.1.1：
1. 重新載入 Extension
2. 刷新所有使用中的頁面
3. 適應新的快捷鍵：
   - Hover 翻譯：只使用 `Ctrl`（不再使用 Cmd）
   - 整頁翻譯：改用 `Ctrl+Shift+A`

## [1.1.0] - 2025-11-01

### Added - 重大功能更新 🎉

#### 🚀 Google Translate 引擎支援
- ✅ 新增 Google Translate 免費 API 整合
- ✅ 雙引擎系統：Google Translate（快速）+ Ollama（隱私）
- ✅ 設定介面支援引擎切換
- ✅ 預設使用 Google Translate（極快翻譯速度）
- ✅ 語言自動檢測（Google Translate）

#### ⚡ Hover 翻譯功能（類似沉浸式翻譯）
- ✅ 滑鼠懸停 + Ctrl/Cmd 鍵即時翻譯
- ✅ 自動句子分割（支援中英文標點）
- ✅ 逐句雙語對照顯示
- ✅ 不需選取文字，直接 hover 即可
- ✅ 翻譯結果緩存優化
- ✅ 支援多種元素（p, div, h1-h6, li, td, th, blockquote, pre）

#### ⌨️ 輸入增強功能（三下空格翻譯）
- ✅ 快速按三下空格自動翻譯輸入內容
- ✅ 支援所有輸入框（input, textarea, contentEditable）
- ✅ 自動替換內容並保持光標位置
- ✅ 適用於郵件、社交媒體、聊天等場景
- ✅ 智能檢測（500ms 內三次空格）

#### 🌐 雙向語言設定
- ✅ 分離「閱讀翻譯」和「輸入翻譯」語言設定
- ✅ 閱讀翻譯：將網頁內容翻譯成母語
- ✅ 輸入翻譯：將母語輸入翻譯成目標語言
- ✅ 完美支援雙向翻譯工作流程
- ✅ 範例：讀英文→中文，寫中文→英文

### Enhanced
- ✨ 改進翻譯緩存機制（支援模式分離）
- ✨ 優化錯誤處理（Extension context invalidation）
- ✨ 更新 UI（新增引擎選擇、雙語言設定）
- ✨ 更友善的通知訊息
- ✨ 新增調試日誌（mode tracking）

### Documentation
- 📝 新增 `BILINGUAL-GUIDE.md`（雙向翻譯使用指南）
- 📝 新增 `DEBUG-GUIDE.md`（調試指南）
- 📝 新增 `test-hover.html`（Hover 翻譯測試頁）
- 📝 新增 `test-input.html`（輸入增強測試頁）
- 📝 更新 README.md（新功能說明）
- 📝 更新 popup.html（新增快捷鍵說明）

### Technical Details
- Google Translate API 整合（免費 endpoint）
- 模式化翻譯請求（reading vs writing）
- 焦點管理（focusin/focusout 監聽）
- 時間戳檢測（三次空格間隔判斷）
- DOM 事件觸發（input/change 兼容性）
- 語言代碼映射（支援 8 種語言）

### Performance
- ⚡ Google Translate 翻譯速度提升 10-20 倍
- ⚡ 句子分割優化（正則表達式）
- ⚡ 緩存優化（mode-aware caching）

### Breaking Changes
- ⚠️ 設定結構變更：`targetLanguage` → `readingLanguage` + `writingLanguage`
- ⚠️ 舊版本設定會自動遷移到新結構

### Migration Guide
從 v1.0.0 升級到 v1.1.0：
1. 重新載入 Extension
2. 刷新所有使用中的頁面
3. 檢查設定（會自動遷移到新結構）
4. 推薦：設定「閱讀翻譯」為母語，「輸入翻譯」為目標外語

## [1.0.0] - 2025-11-01

### Added - 初始發布
- ✅ Chrome Extension (Manifest V3)
- ✅ 選取翻譯功能（Alt+T）
- ✅ 整頁翻譯功能（Alt+Shift+T）
- ✅ 雙語並排顯示
- ✅ Ollama 本地 AI 整合
- ✅ 支援所有 Ollama 模型（預設：gpt-oss:20b）
- ✅ 現代化漸層紫色 UI
- ✅ 設定介面（popup.html）
- ✅ CORS 配置指南（macOS/Linux/Windows）
- ✅ 完整繁體中文文檔
- ✅ MIT License

### Technical Details
- Service Worker for background API communication
- Content Scripts for DOM manipulation
- TreeWalker API for efficient text traversal
- Chrome Storage API for settings persistence
- Custom CSS for bilingual display with animations

### Documentation
- README.md with installation guide
- TROUBLESHOOTING.md for debugging
- Multiple installation guides for different platforms
- GitHub setup and release guides

### Known Issues
- None reported yet

---

## Version History Summary

| Version | Date | Key Changes |
|---------|------|-------------|
| 1.1.1 | 2025-11-01 | 快捷鍵優化、移除 Cmd 熱鍵、修正 manifest 格式 |
| 1.1.0 | 2025-11-01 | Google Translate 引擎、Hover 翻譯、輸入增強、雙向語言 |
| 1.0.0 | 2025-11-01 | Initial release with core translation features |

---

## Upgrade Guide

### From Future Versions
Instructions will be added as new versions are released.

### Important Notes
- Always backup your settings before upgrading
- Check CORS configuration after Ollama updates
- Review release notes for breaking changes

---

**📝 Update Instructions:**

When releasing a new version:
1. Update version in `manifest.json`
2. Add entry to this CHANGELOG.md
3. Update VERSION_INFO.md
4. Create git tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
5. Push tag: `git push origin vX.Y.Z`
6. Create GitHub Release with notes from this changelog

---

[Unreleased]: https://github.com/lmanchu/iris-immersive-translate/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/lmanchu/iris-immersive-translate/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/lmanchu/iris-immersive-translate/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/lmanchu/iris-immersive-translate/releases/tag/v1.0.0
