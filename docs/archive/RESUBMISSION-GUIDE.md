# Fliplang v1.2.1 - Chrome Web Store Resubmission Guide

**Date**: 2025-11-20
**Status**: Ready for resubmission

---

## What Was Fixed

### ❌ Previous Rejection (v1.2.0)
- **Reason**: Purple Potassium - `scripting` permission violation
- **Problem**: Extension requested `scripting` permission without actually using it

### ✅ Changes in v1.2.1
1. **Removed `scripting` permission** from manifest.json
2. **Version bumped** from 1.2.0 → 1.2.1
3. **Created comprehensive documentation**:
   - `PERMISSIONS.md` - Full permission justification
   - `CHROME-STORE-REVIEWER-NOTE.md` - Note for reviewers

---

## Current Permissions (Clean)

### Required Permissions (2)
- ✅ `activeTab` - Read text when user triggers translation
- ✅ `storage` - Save user preferences

### Host Permissions
- ✅ `localhost/*` - Local Ollama connection (privacy feature)
- ✅ `<all_urls>` - Universal translation on any website

**All permissions are essential and fully justified in PERMISSIONS.md**

---

## Package Details

📦 **File**: `fliplang-v1.2.1.zip`
📏 **Size**: 744 KB
✅ **Verified**: All core files included

**Contents**:
- manifest.json (v1.2.1, no scripting permission)
- background.js
- content.js
- popup.html
- popup.js
- icons/ (16, 48, 128)
- styles/

---

## Resubmission Steps

### 1. Go to Chrome Web Store Developer Console
URL: https://chrome.google.com/webstore/devconsole

### 2. Find Fliplang (Purple Potassium)
- Should show "Rejected" status
- Click on the item

### 3. Upload New Package
- Click "Upload new package" or "Edit"
- Upload: `fliplang-v1.2.1.zip`
- Wait for upload to complete

### 4. Update Store Listing (if needed)

**Description** (can add this paragraph about permissions):
```
🔒 Privacy & Permissions:
Fliplang uses minimal permissions for core functionality:
• activeTab: Read text only when you trigger translation
• storage: Remember your language preferences
• localhost: Connect to your local Ollama (optional, for offline translation)

No tracking, no analytics, no data collection. Open source on GitHub.
```

### 5. Add Reviewer Note (IMPORTANT!)

In "Additional information for reviewer" or "Justification" field, paste:

```
Re-submission for v1.2.1

Previous rejection: Purple Potassium - scripting permission violation

FIXED: Removed 'scripting' permission from manifest.json
- This permission was not being used in the code
- All functionality works without it
- Code uses only static content_scripts (no dynamic injection)

Current permissions (2):
- activeTab: Read text when user explicitly triggers translation
- storage: Save user preferences locally

See PERMISSIONS.md in package for full justification of all permissions.

Version: 1.2.1
Extension is fully functional and privacy-focused.
```

### 6. Upload Assets (if missing)

**Required**:
- Icon 128x128
- Screenshot 1280x800 (at least 1)
- Small promo tile 440x280

**All assets available in**: `promo-assets/`

### 7. Submit for Review

- Review all information
- Check "Distribution" settings (Public? Unlisted?)
- Click "Submit for review"

---

## What to Expect

### Timeline
- **Review time**: 1-3 business days (typically)
- **Expected result**: Approved (permission issue fixed)

### If Approved
- Extension will be published to Chrome Web Store
- Users can install from: chrome.google.com/webstore/detail/[your-id]

### If Rejected Again
- Read rejection reason carefully
- Check reviewer feedback
- Contact support if unclear: chrome-webstore-support@google.com

---

## Verification Checklist

Before submitting, verify:

- [x] `fliplang-v1.2.1.zip` created successfully
- [x] manifest.json version = 1.2.1
- [x] manifest.json permissions = ["activeTab", "storage"] (no scripting!)
- [x] PERMISSIONS.md exists and comprehensive
- [x] CHROME-STORE-REVIEWER-NOTE.md ready to copy/paste
- [x] All promo assets ready in promo-assets/
- [x] Privacy policy URL active (if required)

---

## Support Documentation

**For Reviewers**:
- Full permission justification: `PERMISSIONS.md`
- Quick reviewer note: `CHROME-STORE-REVIEWER-NOTE.md`

**For Development**:
- Main README: `README.md`
- Privacy Policy: `PRIVACY-POLICY.md`
- Changelog: `CHANGELOG.md`

---

## Contact

**Developer**: lman.chu@gmail.com
**GitHub**: https://github.com/lmanchu/fliplang
**Issues**: https://github.com/lmanchu/fliplang/issues

---

## Quick Command Reference

```bash
# Verify package contents
unzip -l fliplang-v1.2.1.zip

# Check manifest version
grep '"version"' manifest.json

# Check permissions
grep -A5 '"permissions"' manifest.json

# Rebuild package (if needed)
./package-for-chrome-store.sh
```

---

**Status**: ✅ Ready to submit
**Confidence**: High - Permission issue resolved
**Date**: 2025-11-20
