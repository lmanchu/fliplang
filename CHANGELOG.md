# Changelog

All notable changes to Iris Immersive Translate will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- [ ] 懸浮翻譯模式
- [ ] PDF 文件翻譯支援
- [ ] 影片字幕翻譯
- [ ] 翻譯歷史記錄
- [ ] 自訂提示詞（Prompt）
- [ ] 批次翻譯性能優化
- [ ] 支援其他 LLM API（OpenAI, Gemini 等）
- [ ] 英文文檔

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

[Unreleased]: https://github.com/lmanchu/iris-immersive-translate/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/lmanchu/iris-immersive-translate/releases/tag/v1.0.0
