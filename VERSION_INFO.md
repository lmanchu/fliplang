# 📦 Version Information

## Current Version

**Version:** 1.0.0
**Release Date:** 2025-11-01
**Status:** Stable Release
**Code Name:** "Iris Initial"

---

## Version Details

### Manifest Version
- **manifest.json:** `"version": "1.0.0"`
- **Manifest V3:** Chrome Extension API version

### Supported Platforms
- ✅ Chrome 88+
- ✅ BrowserOS
- ✅ Edge (Chromium)
- ✅ Brave
- ⚠️ Firefox (requires Manifest V2 adaptation)

### System Requirements
- **Ollama:** Latest version
- **Recommended Models:** gpt-oss:20b, llama3.3, qwen2.5, gemma2
- **RAM:** 8GB+ recommended
- **OS:** macOS, Linux, Windows

---

## Dependencies

### Runtime Dependencies
- **Ollama:** Latest version
  - API Endpoint: `http://localhost:11434`
  - Required CORS configuration

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
├── manifest.json          (v1.0.0)
├── background.js          (v1.0.0)
├── content.js             (v1.0.0)
├── popup.html             (v1.0.0)
├── popup.js               (v1.0.0)
├── styles/
│   └── translate.css      (v1.0.0)
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── docs/
    ├── README.md
    ├── CHANGELOG.md
    ├── LICENSE
    └── ...
```

---

## Git Information

### Current Branch
- **main** (default)

### Tags
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
  "ollamaUrl": "http://localhost:11434",
  "model": "gpt-oss:20b",
  "targetLanguage": "繁體中文",
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
- **Short text (< 100 words):** 2-5 seconds
- **Medium text (100-500 words):** 5-15 seconds
- **Full page:** Varies by content size

*Note: Speed depends on Ollama model size and hardware*

### Resource Usage
- **Extension Size:** ~50KB (code only)
- **Memory Usage:** ~10MB (Chrome extension)
- **Ollama Model:** 4-20GB (depending on model)

---

## API Compatibility

### Ollama API
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
| 2025-11-01 | 1.0.0 | Major | Initial release |

---

## Next Version Planning

### v1.1.0 (Planned)
- Floating translation tooltip
- Translation history
- Custom keyboard shortcuts
- UI improvements

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
**Next Review:** When preparing v1.1.0 release
