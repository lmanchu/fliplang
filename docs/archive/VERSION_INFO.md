# 📦 Version Information

## Current Version

**Version:** 1.1.1
**Release Date:** 2025-11-01
**Status:** Stable Release
**Code Name:** "Hotkey Harmony"

---

## Version Details

### Manifest Version
- **manifest.json:** `"version": "1.1.1"`
- **Manifest V3:** Chrome Extension API version

### Supported Platforms
- ✅ Chrome 88+
- ✅ BrowserOS
- ✅ Edge (Chromium)
- ✅ Brave
- ⚠️ Firefox (requires Manifest V2 adaptation)

### System Requirements
- **Translation Engine:**
  - Google Translate: No requirements (default, fast)
  - Ollama: Latest version (optional, privacy)
- **Recommended Models (Ollama):** gpt-oss:20b, llama3.3, qwen2.5, gemma2
- **RAM:** 8GB+ recommended (for Ollama)
- **OS:** macOS, Linux, Windows

---

## Dependencies

### Runtime Dependencies
- **Google Translate API:** Free public endpoint (no API key required)
- **Ollama (Optional):** Latest version
  - API Endpoint: `http://localhost:11434`
  - Required CORS configuration (only when using Ollama)

### Browser APIs Used
- Chrome Extension Manifest V3
- chrome.commands (keyboard shortcuts)
- chrome.storage.sync (settings persistence)
- chrome.runtime (messaging)
- chrome.tabs (tab management)

### No External Libraries
- Pure JavaScript (no npm dependencies)
- No build process required
- Direct installation from source

---

## File Structure & Versions

```
iris-immersive-translate/
├── manifest.json          (v1.1.1)
├── background.js          (v1.1.1) - Google Translate + Ollama
├── content.js             (v1.1.1) - Hover (Ctrl only) + Input enhancement
├── popup.html             (v1.1.1) - Dual language settings + updated shortcuts
├── popup.js               (v1.1.1)
├── styles/
│   └── translate.css      (v1.1.1) - Sentence-by-sentence styles
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── test-hover.html        (v1.1.0) - NEW
├── test-input.html        (v1.1.0) - NEW
└── docs/
    ├── README.md
    ├── CHANGELOG.md
    ├── BILINGUAL-GUIDE.md (v1.1.0) - NEW
    ├── DEBUG-GUIDE.md     (v1.1.0) - NEW
    ├── LICENSE
    └── ...
```

---

## Git Information

### Current Branch
- **main** (default)

### Tags
- `v1.1.1` (2025-11-01) - Latest
- `v1.1.0` (2025-11-01)
- `v1.0.0` (2025-11-01)

### Commits
- Total: 2 commits
- Initial: `c9ee930` - feat: Initial commit
- Update: `29d52c8` - docs: Add MIT License and update README

### Repository
- **URL:** https://github.com/lmanchu/iris-immersive-translate
- **Type:** Public
- **License:** MIT

---

## Configuration Versions

### Default Settings
```json
{
  "translationEngine": "google",
  "ollamaUrl": "http://localhost:11434",
  "model": "gpt-oss:20b",
  "readingLanguage": "繁體中文",
  "writingLanguage": "English",
  "enabled": true
}
```

### CORS Configuration
- **macOS LaunchAgent:** com.ollama.cors.plist
- **Environment Variable:** OLLAMA_ORIGINS
- **Required Origins:** `chrome-extension://*,http://localhost:*,https://localhost:*,file://*,*`

---

## Performance Metrics

### Translation Speed (Approximate)

**Google Translate (Default):**
- **Short text (< 100 words):** 0.2-0.5 seconds ⚡
- **Medium text (100-500 words):** 0.5-1 second ⚡
- **Full page:** 1-3 seconds ⚡

**Ollama (Optional):**
- **Short text (< 100 words):** 2-5 seconds
- **Medium text (100-500 words):** 5-15 seconds
- **Full page:** Varies by content size

*Note: Ollama speed depends on model size and hardware*

### Resource Usage
- **Extension Size:** ~50KB (code only)
- **Memory Usage:** ~10MB (Chrome extension)
- **Ollama Model:** 4-20GB (depending on model)

---

## API Compatibility

### Google Translate API (Primary)
- **Endpoint:** `https://translate.googleapis.com/translate_a/single`
- **Method:** GET
- **Auth:** None required (free public API)
- **Auto-detect:** Yes

### Ollama API (Secondary)
- **Version:** Compatible with Ollama 0.12.8+
- **Endpoint:** `/api/generate`
- **Method:** POST
- **Stream:** false (non-streaming mode)

### Request Format
```json
{
  "model": "gpt-oss:20b",
  "prompt": "請將以下文字翻譯成繁體中文...",
  "stream": false,
  "options": {
    "temperature": 0.3,
    "top_p": 0.9
  }
}
```

---

## Build Information

### No Build Process
- Direct source distribution
- No compilation required
- No transpilation needed
- Load unpacked in Chrome

### Development Mode
- Enable Developer Mode in chrome://extensions/
- Load unpacked from source directory
- Reload extension after code changes

---

## Update History

| Date | Version | Type | Description |
|------|---------|------|-------------|
| 2025-11-01 | 1.1.1 | Patch | Hotkey optimization, Remove Cmd key, Fix manifest format |
| 2025-11-01 | 1.1.0 | Minor | Google Translate, Hover translation, Input enhancement, Dual language |
| 2025-11-01 | 1.0.0 | Major | Initial release |

---

## Next Version Planning

### v1.2.0 (Planned)
- PDF translation support
- Multiple language support
- Performance optimizations

### v2.0.0 (Future)
- Support for other LLM APIs
- Advanced customization options
- Cross-browser support

---

## Version Numbering

Following [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR.MINOR.PATCH**
- **MAJOR:** Breaking changes
- **MINOR:** New features (backwards compatible)
- **PATCH:** Bug fixes (backwards compatible)

---

**Last Updated:** 2025-11-01
**Next Review:** When preparing v1.2.0 release
