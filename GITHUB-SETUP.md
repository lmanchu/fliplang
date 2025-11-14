# 🚀 GitHub Repository 設置指南

## 方法 1: 使用 GitHub 網頁界面（推薦）

1. **前往 GitHub 創建新 repository**
   - 打開 https://github.com/new
   - Repository name: `iris-immersive-translate`
   - Description: `🌐 Privacy-first immersive translation using local Ollama AI models | 基於本地 AI 的隱私優先沉浸式翻譯`
   - 選擇 **Public**（公開）
   - **不要** 勾選 "Initialize this repository with a README"
   - 點擊 "Create repository"

2. **連接本地 repository 到 GitHub**

   在創建 repository 後，GitHub 會顯示設置說明。執行以下命令：

   ```bash
   cd /Users/lman/iris-immersive-translate

   # 添加 remote（替換 YOUR_USERNAME 為你的 GitHub 用戶名）
   git remote add origin https://github.com/YOUR_USERNAME/iris-immersive-translate.git

   # 推送代碼
   git branch -M main
   git push -u origin main
   ```

3. **完成！**

   你的代碼現在已經在 GitHub 上了：
   `https://github.com/YOUR_USERNAME/iris-immersive-translate`

## 方法 2: 使用 SSH（如果已設置 SSH key）

```bash
cd /Users/lman/iris-immersive-translate

# 添加 SSH remote
git remote add origin git@github.com:YOUR_USERNAME/iris-immersive-translate.git

# 推送代碼
git branch -M main
git push -u origin main
```

## 🎯 後續步驟

### 添加 Topics（標籤）

在 GitHub repository 頁面，點擊右上方的 ⚙️ Settings，然後在 About 區域添加以下 topics：

- `chrome-extension`
- `translation`
- `ollama`
- `ai`
- `privacy`
- `local-ai`
- `immersive-translate`
- `manifest-v3`
- `traditional-chinese`

### 設置 Repository 詳情

在 repository 的 "About" 設置中：
- Website: 可以填寫你的個人網站或 BrowserOS 相關連結
- Topics: 如上所述
- Description: `🌐 Privacy-first immersive translation using local Ollama AI models | 基於本地 AI 的隱私優先沉浸式翻譯`

### 添加 License

如果你想添加 MIT License：

1. 在 GitHub repository 頁面點擊 "Add file" → "Create new file"
2. 檔案名稱輸入：`LICENSE`
3. 點擊右側的 "Choose a license template"
4. 選擇 "MIT License"
5. 填寫你的名字
6. 點擊 "Review and submit"
7. Commit 這個新文件

### 啟用 GitHub Pages（可選）

如果你想創建專案網站：

1. 前往 Settings → Pages
2. Source 選擇 "Deploy from a branch"
3. Branch 選擇 "main" 和 "/ (root)"
4. 點擊 Save

## 📊 維護 GitHub 聲量的建議

### 1. 定期更新 README

- 添加截圖或 GIF 展示功能
- 更新 badges（stars, license, version）
- 添加更多使用案例

### 2. 創建 Releases

每次重要更新時創建 release：

```bash
# 創建新版本的 tag
git tag -a v1.0.0 -m "Release v1.0.0 - Initial release"
git push origin v1.0.0
```

然後在 GitHub 上創建 Release note。

### 3. 撰寫 Issues 和 Discussions

- 開放 Issues 讓用戶回報問題
- 開啟 Discussions 讓社群交流
- 回應用戶的問題和建議

### 4. 添加 GitHub Actions（CI/CD）

可以添加自動化測試、linting 等。

### 5. 社交媒體分享

- 在 Twitter/X 上分享你的專案
- 在相關的 Reddit 社群分享
- 寫一篇 blog post 介紹開發過程

### 6. 提交到 Awesome Lists

搜尋相關的 "awesome-" list 並提交 PR：
- awesome-chrome-extensions
- awesome-ollama
- awesome-translation

### 7. 產品發布平台

- Product Hunt
- Hacker News (Show HN)
- Reddit (r/programming, r/chrome)

---

**Good luck! 🚀**
