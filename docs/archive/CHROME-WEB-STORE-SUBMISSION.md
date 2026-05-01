# Chrome Web Store Submission Guide

## 📦 Package Status: READY

Version: **1.2.0**
Date: **2025-11-14**

---

## ✅ Pre-Submission Checklist

### Required Files (Included in ZIP)
- [x] `manifest.json` (v1.2.0)
- [x] `background.js` (with freemium logic)
- [x] `content.js` (translation engine)
- [x] `popup.html` + `popup.js` (settings UI)
- [x] `icons/icon16.png` (16x16)
- [x] `icons/icon48.png` (48x48)
- [x] `icons/icon128.png` (128x128)
- [x] `styles/translate.css` (UI styling)

### Required Assets (Upload Separately)
- [x] **Small Promo Tile** (440x280): `promo-assets/small-promo-tile-440x280.png`
- [x] **Marquee Promo Tile** (1400x560): `promo-assets/marquee-promo-tile-1400x560.png`
- [x] **Store Icon** (128x128): `icons/icon128.png`

### Required Information
- [x] **Short Description** (132 chars): See `chrome-web-store-description.md`
- [x] **Detailed Description**: See `chrome-web-store-description.md`
- [x] **Privacy Policy URL**: https://github.com/lmanchu/fliplang/blob/main/PRIVACY-POLICY.md
- [x] **Homepage URL**: https://github.com/lmanchu/fliplang
- [x] **Support URL**: https://github.com/lmanchu/fliplang/issues
- [x] **Category**: Productivity
- [x] **Language**: English (can add more later)

### Optional (Can Add Later)
- [ ] Screenshots (5-8 recommended)
- [ ] Video demo
- [ ] Additional language support

---

## 📝 Step-by-Step Submission Process

### Step 1: Create ZIP Package

```bash
# Run the packaging script
./package-for-chrome-store.sh

# Output: fliplang-v1.2.0.zip
```

### Step 2: Go to Chrome Web Store Developer Dashboard

1. Visit: https://chrome.google.com/webstore/devconsole
2. Sign in with your Google account
3. Click **"Add a new item"**

### Step 3: Upload ZIP Package

1. Click **"Choose file"** or drag the ZIP
2. Upload: `fliplang-v1.2.0.zip`
3. Wait for validation (should pass without errors)

### Step 4: Fill in Store Listing

#### Store Listing Tab

**Product Details**
- **Name**: Fliplang
- **Summary**: `Privacy-first translation: Fast Google Translate + Local AI. Hover, select, or translate entire pages with bilingual display.`

**Description**
Copy from: `chrome-web-store-description.md` (Detailed Description section)

**Category**
- Primary: **Productivity**

**Language**
- **English (United States)**

#### Graphic Assets

**Icon**
- Upload: `icons/icon128.png` (128x128)

**Screenshots** (Optional for now)
- Skip for initial submission
- Can add later via "Edit" after publishing

**Promotional Images**
- **Small tile** (440x280 - REQUIRED): Upload `promo-assets/small-promo-tile-440x280.png`
- **Marquee tile** (1400x560 - OPTIONAL): Upload `promo-assets/marquee-promo-tile-1400x560.png`

#### Additional Fields

**Website**
- https://github.com/lmanchu/fliplang

**Support URL**
- https://github.com/lmanchu/fliplang/issues

**Support Email**
- Your developer email (will be shown to users)

### Step 5: Privacy Practices

**Privacy Policy**
- URL: https://github.com/lmanchu/fliplang/blob/main/PRIVACY-POLICY.md

**Single Purpose Description**
```
Fliplang provides bilingual translation services using either Google Translate API or local Ollama AI models, giving users the choice between fast cloud translation and private local translation.
```

**Permission Justifications**

1. **activeTab**
   - *Reason*: Required to access and translate content on the page user is viewing

2. **storage**
   - *Reason*: Store user preferences (engine choice, shortcuts, daily usage count) locally

3. **scripting**
   - *Reason*: Inject translation UI and bilingual display into web pages

4. **host_permissions: <all_urls>**
   - *Reason*: Allow translation on any website user visits

5. **host_permissions: localhost**
   - *Reason*: Connect to local Ollama AI server for private translation

**Data Usage**

- **Google Translate Mode**: Text sent to Google Translate API for translation
- **Ollama Mode**: All data processed locally, nothing sent to external servers
- **No data collection**: Extension does not collect, store, or transmit user data to our servers
- **Local storage only**: Usage statistics and preferences stored locally in browser

**Certification**
- [x] Check: "I certify that my extension complies with Chrome Web Store policies"

### Step 6: Review & Publish

1. Click **"Submit for review"**
2. Review time: Typically 1-3 business days
3. You'll receive an email when review is complete

### Step 7: After Approval

**Publish Settings**
- **Visibility**: Public (listed on Chrome Web Store)
- **Distribution**: Anyone can install
- **Pricing**: Free

---

## 🚨 Common Issues & Solutions

### Issue: "Manifest version 3 required"
- **Solution**: Already using Manifest V3 ✅

### Issue: "Missing privacy policy"
- **Solution**: Added URL in manifest.json and store listing ✅

### Issue: "Permissions need justification"
- **Solution**: Provided detailed justifications above ✅

### Issue: "Icon doesn't meet requirements"
- **Solution**: All icons are correct sizes (16, 48, 128) ✅

### Issue: "Description too long/short"
- **Solution**: Short description is 129 chars (under 132 limit) ✅

---

## 📊 Post-Launch Checklist

After Chrome Web Store approval:

- [ ] Add link to Chrome Web Store in README.md
- [ ] Update website/social media with install link
- [ ] Monitor reviews and respond promptly
- [ ] Track installation stats
- [ ] Prepare Product Hunt launch (Task #7)

---

## 🔗 Important Links

- **Developer Dashboard**: https://chrome.google.com/webstore/devconsole
- **Chrome Web Store Policies**: https://developer.chrome.com/docs/webstore/program-policies/
- **Manifest V3 Migration**: https://developer.chrome.com/docs/extensions/mv3/intro/
- **Extension Best Practices**: https://developer.chrome.com/docs/extensions/mv3/devguide/

---

## 📞 Support Contacts

- **GitHub Issues**: https://github.com/lmanchu/fliplang/issues
- **Email**: (Add your support email here)

---

**Generated**: 2025-11-14
**Version**: 1.2.0
**Status**: Ready for submission 🚀
