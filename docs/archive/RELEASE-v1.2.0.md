# 🚀 Fliplang v1.2.0 - Freemium Model Release

**Release Date**: November 14, 2025
**Version**: 1.1.1 → 1.2.0

---

## 🎯 What's New

### Freemium Business Model

Fliplang now includes a sustainable freemium model to support ongoing development while keeping the core features free for everyone!

#### For Free Users:
- **50 translations per day** ✨
- Automatic reset at midnight (local timezone)
- Real-time usage tracking in popup
- Beautiful progress bar showing remaining translations
- Upgrade prompt when running low (≤10 remaining)

#### For Pro Users (Coming Soon):
- **Unlimited translations** 🚀
- Priority support
- Advanced AI model options
- Infrastructure ready - payment integration coming soon!

---

## 🎨 New Features

### 1. Daily Usage Statistics
- Visual progress bar with gradient design
- Real-time counter: "X/50 translations used"
- Remaining translations display
- Pro badge for premium users

### 2. Smart Limit Management
- Checks limit before each translation
- Graceful error messages when limit reached
- Non-intrusive tracking (local storage only)
- Privacy-first approach (no server calls)

### 3. Upgrade Path
- "Upgrade to Pro" button (appears when remaining ≤ 10)
- Clear benefits communication
- One-click upgrade flow (payment integration coming)

---

## 📊 Technical Details

### Storage Structure
```javascript
{
  isPro: false,           // Pro user flag
  usageCount: 0,         // Today's translation count
  lastResetDate: "..."   // Last reset date (toDateString)
}
```

### Daily Reset Logic
- Compares current date with `lastResetDate`
- Automatic reset when new day detected
- Timezone-aware (uses local time)

### Files Modified
- `background.js` (+120 lines): Usage limit management
- `content.js` (+5 lines): Limit error handling
- `popup.html` (+60 lines): Usage stats UI
- `popup.js` (+60 lines): Stats loading & display
- `manifest.json`: Version bump 1.1.1 → 1.2.0

---

## 🔒 Privacy Commitment

**All usage tracking is 100% local:**
- No data sent to external servers
- Stored in `chrome.storage.local` only
- No analytics or tracking
- Fully transparent (open source)

---

## 🎯 Business Model Rationale

We believe in:
- **Free forever core features**: Basic translation will always be free
- **Generous free tier**: 50/day is enough for most users
- **Sustainable development**: Pro subscriptions fund ongoing improvements
- **User choice**: Pick what works for you (free or pro)

---

## 📈 Usage Stats (Expected)

Based on similar extensions:
- **Average user**: 10-20 translations/day (well within free tier)
- **Power user**: 30-50 translations/day (at free tier limit)
- **Professional user**: 50+ translations/day (would benefit from Pro)

---

## 🚀 Upgrade Benefits (Coming Soon)

### Pro Plan Features:
- ✨ **Unlimited translations** - No daily limits
- 🎯 **Priority support** - Fast email responses
- 🤖 **Advanced AI models** - Access to premium Ollama models
- 🔐 **Enhanced privacy** - Optional encrypted cloud sync
- 📊 **Usage analytics** - Personal translation stats dashboard

**Pricing**: TBD (expected ~$4.99/month or $49.99/year)

---

## 🐛 Bug Fixes

- None (pure feature release)

---

## 🔧 Migration Notes

### For Existing Users:
- **Automatic**: No action needed
- Existing users start with 0 usage count
- Counter resets at your local midnight
- All existing settings preserved

### For Developers:
- New API: `chrome.runtime.sendMessage({ action: 'getUsageStats' })`
- Returns: `{ isPro, usageCount, limit, remaining, resetDate }`

---

## 📝 Changelog

### Added
- Daily translation limit (50/day for free users)
- Usage statistics in popup UI
- Progress bar with remaining count
- "Upgrade to Pro" CTA button
- Pro user infrastructure (ready for monetization)
- Automatic midnight reset logic

### Changed
- Version: 1.1.1 → 1.2.0
- Popup UI: Added usage stats section
- Translation flow: Added limit check

### Technical
- New functions: `checkUsageLimit()`, `incrementUsageCount()`, `getUsageStats()`
- New storage keys: `isPro`, `usageCount`, `lastResetDate`
- Enhanced error handling for limit reached

---

## 🎬 Demo Scenarios

### Scenario 1: Normal Usage
1. User translates 10 times today
2. Popup shows: "10/50 translations used"
3. Progress bar: 20% filled
4. Message: "40 translations remaining today"

### Scenario 2: Approaching Limit
1. User has used 45 translations
2. Popup shows: "45/50 translations used"
3. Progress bar: 90% filled
4. Message: "5 translations remaining today"
5. "Upgrade to Pro" button appears

### Scenario 3: Limit Reached
1. User attempts 51st translation
2. Error message: "🚫 Daily limit reached (50/day). Upgrade to Pro for unlimited translations!"
3. Translation fails gracefully
4. User can upgrade or wait until midnight

### Scenario 4: Pro User
1. Popup shows: "∞ Unlimited" in progress bar
2. "PRO" badge displayed
3. Message: "You have unlimited translations! 🎉"
4. No usage counter or upgrade button

---

## 🙏 Credits

- **Developed by**: Iris AI System (MAGI)
- **Built with**: Claude Code + Happy Engineering
- **License**: MIT
- **Repository**: https://github.com/lmanchu/fliplang

---

## 🔮 Coming Next (v1.3.0)

- Payment integration for Pro upgrades
- Chrome Web Store launch
- Product Hunt submission
- Advanced AI model selection for Pro users
- Translation history dashboard

---

**Thank you for using Fliplang! 🌐**

For questions, issues, or feedback:
- GitHub Issues: https://github.com/lmanchu/fliplang/issues
- Privacy Policy: https://github.com/lmanchu/fliplang/blob/main/PRIVACY-POLICY.md
