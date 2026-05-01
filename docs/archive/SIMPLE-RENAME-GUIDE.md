# 🚀 最簡單的 GitHub Repo 改名方法

## 方法一：使用自動化腳本（推薦，30秒完成）

### 步驟：

1. **獲取 GitHub Token** (一次性設置):
   - 前往: https://github.com/settings/tokens
   - 點擊 "Generate new token (classic)"
   - 勾選 `repo` scope
   - 點擊 "Generate token"
   - 複製生成的 token

2. **執行腳本**:
   ```bash
   # 設置 token (替換成你的 token)
   export GITHUB_TOKEN='ghp_your_token_here'

   # 執行改名腳本
   cd ~/Iris/projects/immersive-translate
   ./rename-github-repo.sh
   ```

3. **完成！** 腳本會自動：
   - ✅ 改名 repository: `iris-immersive-translate` → `fliplang`
   - ✅ 更新 description
   - ✅ 添加 topics (chrome-extension, translation, privacy, etc.)
   - ✅ 更新本地 git remote URL

---

## 方法二：手動網頁操作（2分鐘）

### 步驟 1: 改名 Repository

1. 前往: https://github.com/lmanchu/iris-immersive-translate/settings
2. 在 "Repository name" 欄位，把 `iris-immersive-translate` 改成 `fliplang`
3. 點擊 **Rename** 按鈕
4. GitHub 會提示確認，點擊確認

### 步驟 2: 更新 Description

1. 在同一頁面，找到 "Description" 欄位
2. 輸入:
   ```
   Privacy-first translation Chrome extension: Fast Google Translate + Local AI (Ollama). Hover, select, or translate entire pages.
   ```
3. 點擊 Save

### 步驟 3: 添加 Topics

1. 返回 repo 首頁: https://github.com/lmanchu/fliplang
2. 點擊右側 "About" 旁的齒輪圖標 ⚙️
3. 在 "Topics" 欄位添加:
   - `chrome-extension`
   - `translation`
   - `privacy`
   - `ollama`
   - `ai`
   - `google-translate`
   - `bilingual`
   - `productivity`
4. 點擊 Save changes

### 步驟 4: 更新本地 Git Remote

```bash
cd ~/Iris/projects/immersive-translate
git remote set-url origin https://github.com/lmanchu/fliplang.git
git remote -v  # 確認更新成功
```

---

## ✅ 完成確認

改名後檢查：
- [ ] 新 URL 可訪問: https://github.com/lmanchu/fliplang
- [ ] 舊 URL 自動重定向: https://github.com/lmanchu/iris-immersive-translate → 新 URL
- [ ] Description 正確顯示
- [ ] Topics 已添加並顯示
- [ ] 本地 `git remote -v` 顯示新 URL

---

**推薦方法一（腳本），省時省力！**
