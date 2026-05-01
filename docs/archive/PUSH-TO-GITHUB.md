# 🚀 推送到 GitHub - lmanchu/iris-immersive-translate

## 步驟 1️⃣: 在 GitHub 創建 Repository

前往已打開的頁面（或訪問）：https://github.com/new

填寫以下資訊：
- **Repository name:** `iris-immersive-translate`
- **Description:** `🌐 Privacy-first immersive translation using local Ollama AI models | 基於本地 AI 的隱私優先沉浸式翻譯`
- **Public** ✅
- ❌ 不要勾選 "Add a README file"
- ❌ 不要勾選 ".gitignore"
- ❌ 不要勾選 "Choose a license"

點擊 **"Create repository"**

---

## 步驟 2️⃣: 推送代碼

GitHub 創建成功後，在你的終端執行：

```bash
cd /Users/lman/iris-immersive-translate

# Remote 已設置好了
git push -u origin main
```

### 如果要求輸入憑證：

**Username:** `lmanchu`

**Password:** 你需要使用 **Personal Access Token**（不是 GitHub 密碼）

---

## 🔑 如何獲取 Personal Access Token

1. 前往：https://github.com/settings/tokens

2. 點擊 **"Generate new token"** → **"Generate new token (classic)"**

3. 設置：
   - **Note:** `iris-immersive-translate`
   - **Expiration:** 選擇你想要的過期時間（建議 90 days）
   - **Select scopes:** 勾選 `repo`（完整的 repository 存取權限）

4. 點擊 **"Generate token"**

5. **重要：** 複製產生的 token（只會顯示一次！）

6. 在推送時，當要求輸入 Password 時，貼上這個 token

---

## ⚡ 快速執行

如果你已經有 Personal Access Token，直接執行：

```bash
git push -u origin main
```

然後輸入：
- Username: `lmanchu`
- Password: `<你的 Personal Access Token>`

---

## ✅ 成功後

你的專案將在：
**https://github.com/lmanchu/iris-immersive-translate**

---

## 📊 後續優化建議

1. **添加 Topics**（在 repository 首頁右側）：
   - `chrome-extension`
   - `translation`
   - `ollama`
   - `ai`
   - `privacy`
   - `local-ai`
   - `immersive-translate`
   - `manifest-v3`

2. **添加 MIT License**：
   - 在 repository 點擊 "Add file" → "Create new file"
   - 檔名：`LICENSE`
   - 使用模板：MIT License

3. **創建第一個 Release**：
   - 前往 "Releases" → "Create a new release"
   - Tag: `v1.0.0`
   - Title: `v1.0.0 - Initial Release`
   - 描述專案功能和特色

4. **分享到社群**：
   - Twitter/X
   - Reddit (r/chrome, r/selfhosted, r/ollama)
   - Hacker News (Show HN)
   - Product Hunt

---

**準備好了嗎？執行 `git push -u origin main` 🚀**
