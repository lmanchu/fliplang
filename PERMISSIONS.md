# Fliplang - Permission Justification

**Version**: 1.2.1
**Date**: 2025-11-20

## Summary

Fliplang uses **minimal permissions** required for its core translation functionality. All permissions are essential and directly related to the user-facing features.

---

## Required Permissions

### 1. `activeTab`

**Purpose**: Access the currently active tab to translate text on the page.

**Why needed**:
- When user presses **Alt+T** (translate selection hotkey), we need to read the selected text
- When user presses **Ctrl+Shift+A** (translate page hotkey), we need to read all text on the page
- When user hovers over text with **Ctrl** held, we need to read the hovered text

**Scope**: Only the active tab, and only when user explicitly triggers a translation action.

**User benefit**: Enables instant translation of any text on any webpage.

---

### 2. `storage`

**Purpose**: Store user preferences and usage statistics.

**Why needed**:
- Save translation engine preference (Google Translate or Local Ollama)
- Save target language settings
- Save Ollama URL and model configuration
- Track daily translation count for freemium model (50 free translations/day)
- Store Pro subscription status

**Data stored**:
```javascript
{
  translationEngine: 'google',      // User preference
  ollamaUrl: 'http://localhost:11434',  // Ollama configuration
  model: 'gpt-oss:20b',             // AI model selection
  readingLanguage: '繁體中文',        // Target language for reading
  writingLanguage: 'English',       // Target language for input
  enabled: true,                    // Extension on/off
  usageCount: 0,                    // Daily translation count
  lastResetDate: '2025-11-20',      // Usage reset tracking
  isPro: false                      // Subscription status
}
```

**Privacy**: All data stays local. No data is sent to external servers except for translation API calls.

**User benefit**: Remembers user preferences across sessions, tracks daily usage quota.

---

## Host Permissions

### 1. `http://localhost/*` and `http://127.0.0.1/*`

**Purpose**: Allow users to use Local Ollama for private, offline translation.

**Why needed**:
- Connect to local Ollama instance running on user's machine
- Send translation requests to `http://localhost:11434/api/generate`
- Provide privacy-focused translation without sending data to cloud

**User benefit**: Users can translate sensitive content completely offline without any data leaving their machine.

---

### 2. `<all_urls>`

**Purpose**: Enable translation on any website user visits.

**Why needed**:
- Content script needs to inject translation UI (hover tooltip, selection popup) on all pages
- Connect to Google Translate API for fast, free translation
- Support translation on any website (news, documentation, social media, etc.)

**Scope**: Content script only activates when user explicitly:
- Hovers over text with Ctrl held
- Selects text and presses Alt+T
- Presses Ctrl+Shift+A to translate entire page
- Types 3 spaces in input fields to trigger translation

**Privacy**:
- For Google Translate: Only selected text is sent to `translate.googleapis.com`
- For Ollama: Text stays completely local
- No tracking, analytics, or user data collection

**User benefit**: Universal translation on any website without restrictions.

---

## What We DON'T Request

### ❌ `scripting`
**Removed in v1.2.1** - Not needed. All functionality achieved through static content_scripts.

### ❌ `tabs`
We use `activeTab` instead, which is more privacy-friendly.

### ❌ `webNavigation`, `history`, `bookmarks`
Not needed. We only translate text, we don't track browsing.

### ❌ `cookies`, `identity`
No user tracking or authentication required.

---

## Privacy Commitment

1. **No Analytics**: We don't track what you translate or which sites you visit
2. **No User Data Collection**: No emails, names, or personal information stored
3. **Local-First**: Ollama option keeps everything on your machine
4. **Minimal Permissions**: Only what's absolutely necessary
5. **Open Source**: Full transparency at [github.com/lmanchu/fliplang](https://github.com/lmanchu/fliplang)

---

## Compliance

- ✅ **GDPR Compliant**: No personal data processing
- ✅ **CCPA Compliant**: No data selling or sharing
- ✅ **Manifest V3**: Uses latest Chrome Extension standards
- ✅ **Minimal Permissions**: Follows principle of least privilege

---

## Technical Implementation

All permissions are used exclusively in:

1. **`background.js`**:
   - `chrome.commands.onCommand` (keyboard shortcuts)
   - `chrome.tabs.sendMessage` (communicate with content script)
   - `chrome.storage` (save settings)
   - `fetch` (translation API calls)

2. **`content.js`**:
   - `document.addEventListener` (detect user actions)
   - `chrome.runtime.sendMessage` (request translations)
   - DOM manipulation (show translation UI)

3. **`popup.js`**:
   - `chrome.storage` (read/write settings)
   - UI rendering

**No dynamic code injection. No eval(). No remote code execution.**

---

## Contact

For privacy concerns or questions:
- GitHub: [github.com/lmanchu/fliplang/issues](https://github.com/lmanchu/fliplang/issues)
- Email: lman.chu@gmail.com

---

**Last Updated**: 2025-11-20
**Version**: 1.2.1
