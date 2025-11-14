# GitHub Repository 更名指南

## ✅ 已完成

- [x] 本地代碼已更名為 Fliplang
- [x] 已 commit 並 push 到 GitHub
- [x] 最新 commits 已同步

## 🔄 需要在 GitHub 上執行的操作

### 1. 重新命名 Repository

**步驟：**

1. 前往 GitHub repository 頁面：
   https://github.com/lmanchu/iris-immersive-translate

2. 點擊 **Settings** (設定)

3. 在 "Repository name" 欄位中：
   - 舊名稱：`iris-immersive-translate`
   - 新名稱：`fliplang` ✨

4. 點擊 **Rename** 按鈕

**GitHub 會自動：**
- 設置從舊 URL 到新 URL 的重定向
- 更新所有內部連結
- 保留所有 stars, issues, pull requests

### 2. 更新 Repository Description

**建議描述：**
```
Privacy-first translation Chrome extension: Fast Google Translate + Local AI (Ollama). Hover, select, or translate entire pages.
```

**Topics (建議標籤)：**
- chrome-extension
- translation
- privacy
- ollama
- ai
- google-translate
- bilingual
- productivity

### 3. 更新本地 Git Remote (在完成 GitHub 改名後)

```bash
# GitHub 會自動重定向，但建議更新為新 URL
git remote set-url origin https://github.com/lmanchu/fliplang.git

# 確認更新
git remote -v
```

### 4. 更新 README.md 中的連結

已經更新的連結：
- ✅ GitHub badges
- ✅ Repository references
- ✅ Issues URL

如果 README 中還有其他地方引用舊 repo 名稱，會需要修正。

## 📝 其他需要更新的地方

### Chrome Web Store (未來上架時)
- Website URL: `https://github.com/lmanchu/fliplang`
- Support URL: `https://github.com/lmanchu/fliplang/issues`

### Product Hunt (未來發布時)
- GitHub link: `https://github.com/lmanchu/fliplang`

## ⚠️ 注意事項

1. **GitHub 會保留舊 URL 的重定向**
   - `iris-immersive-translate` → `fliplang` 會自動跳轉
   - 不會影響現有的 clone, fork, stars

2. **如果有其他服務整合**
   - CI/CD (GitHub Actions): 會自動更新
   - Webhooks: 需要手動檢查
   - 第三方服務: 可能需要更新

3. **Clone 的用戶**
   - 舊的 remote URL 仍然有效（GitHub 重定向）
   - 建議更新到新 URL

## 🎯 完成後確認清單

- [ ] GitHub repo 已改名為 `fliplang`
- [ ] Repository description 已更新
- [ ] Topics/tags 已添加
- [ ] 本地 git remote 已更新
- [ ] README.md 中的所有連結已確認正確
- [ ] Chrome Web Store 描述檔中的 URL 已更新

---

**執行完畢後回報，我會協助確認所有連結都正確更新！**
