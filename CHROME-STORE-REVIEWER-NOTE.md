# Chrome Web Store Reviewer Note

## Re-submission for Fliplang v1.2.1

**Previous Rejection**: Purple Potassium - `scripting` permission violation

**Actions Taken**:

### 1. Removed `scripting` Permission ✓
- **Removed** `scripting` from permissions array in manifest.json
- **Reason**: Not needed. All functionality achieved through static content_scripts.
- **Evidence**: No usage of `chrome.scripting` API in codebase.

### 2. Version Update ✓
- Upgraded from v1.2.0 → **v1.2.1**

### 3. Created Comprehensive Permission Justification ✓
- See `PERMISSIONS.md` for full details
- All remaining permissions (`activeTab`, `storage`, `<all_urls>`) are **essential** for core functionality

---

## Current Permissions Breakdown

### Required Permissions (2)

**1. `activeTab`**
- **Purpose**: Read text on active tab when user triggers translation
- **Trigger**: User presses Alt+T (selection) or Ctrl+Shift+A (page)
- **Scope**: Only active tab, only when user explicitly requests

**2. `storage`**
- **Purpose**: Save user preferences and daily usage quota
- **Data**: Language settings, Ollama config, freemium counter (50/day)
- **Privacy**: All data stays local, no cloud sync

### Host Permissions

**1. `localhost/*` and `127.0.0.1/*`**
- **Purpose**: Connect to user's local Ollama instance
- **User Benefit**: Private, offline translation without cloud

**2. `<all_urls>`**
- **Purpose**: Enable translation on any website
- **Privacy**: Content script only injects UI, doesn't track browsing
- **Transparency**: Open source on GitHub

---

## Why This Extension is Safe

### ✅ Minimal Permissions
- Only 2 permissions (down from 3)
- No `tabs`, `history`, `cookies`, `identity`
- Follows principle of least privilege

### ✅ Privacy-First Design
- No analytics or tracking
- No user data collection
- Ollama option keeps everything local

### ✅ Transparent
- Open source: [github.com/lmanchu/fliplang](https://github.com/lmanchu/fliplang)
- Full permission justification in PERMISSIONS.md
- GDPR & CCPA compliant

### ✅ Manifest V3 Compliant
- No remote code execution
- No eval()
- Static content scripts only

---

## How to Verify

1. **Check manifest.json**: `scripting` permission is gone
2. **Search codebase**: No `chrome.scripting` usage
3. **Review PERMISSIONS.md**: Clear justification for all permissions
4. **Test extension**: All features work without `scripting` permission

---

## User Value

Fliplang provides **instant translation** on any website with:
- 50 free translations per day
- Privacy-focused (local Ollama support)
- Fast (Google Translate integration)
- Universal (works on all websites)

Users love it for reading foreign documentation, news, and social media.

---

## Contact

For questions: lman.chu@gmail.com
GitHub Issues: [github.com/lmanchu/fliplang/issues](https://github.com/lmanchu/fliplang/issues)

---

Thank you for reviewing!

**Version**: 1.2.1
**Submission Date**: 2025-11-20
