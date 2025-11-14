#!/bin/bash

# 🚀 GitHub Repository 快速設置腳本
# 此腳本會引導你完成 GitHub repository 的設置

echo "🌐 Iris Immersive Translate - GitHub Setup"
echo "==========================================="
echo ""

# 檢查是否已經在 git repository 中
if [ ! -d .git ]; then
    echo "❌ 錯誤：這不是一個 git repository"
    exit 1
fi

# 詢問 GitHub username
echo "請輸入你的 GitHub username:"
read -r GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username 不能為空"
    exit 1
fi

# 詢問使用 HTTPS 還是 SSH
echo ""
echo "選擇連接方式："
echo "1) HTTPS (推薦，無需設置 SSH key)"
echo "2) SSH (需要已設置 SSH key)"
read -r -p "請選擇 (1 或 2): " CONNECTION_TYPE

REPO_URL=""
if [ "$CONNECTION_TYPE" = "1" ]; then
    REPO_URL="https://github.com/$GITHUB_USERNAME/iris-immersive-translate.git"
elif [ "$CONNECTION_TYPE" = "2" ]; then
    REPO_URL="git@github.com:$GITHUB_USERNAME/iris-immersive-translate.git"
else
    echo "❌ 無效的選擇"
    exit 1
fi

# 設置 git remote
echo ""
echo "📝 設置 remote..."
git remote add origin "$REPO_URL"

if [ $? -eq 0 ]; then
    echo "✅ Remote 設置成功: $REPO_URL"
else
    echo "⚠️  Remote 可能已經存在，嘗試更新..."
    git remote set-url origin "$REPO_URL"
    echo "✅ Remote 已更新: $REPO_URL"
fi

# 設置 main branch
echo ""
echo "📝 設置 main branch..."
git branch -M main

# 提示用戶在 GitHub 上創建 repository
echo ""
echo "⚠️  重要：在推送之前，請先在 GitHub 上創建 repository："
echo ""
echo "   1. 前往 https://github.com/new"
echo "   2. Repository name: iris-immersive-translate"
echo "   3. 選擇 Public"
echo "   4. 不要勾選 'Initialize this repository with a README'"
echo "   5. 點擊 'Create repository'"
echo ""
read -r -p "已經在 GitHub 上創建 repository？ (y/n): " CREATED

if [ "$CREATED" != "y" ] && [ "$CREATED" != "Y" ]; then
    echo ""
    echo "請先創建 repository，然後再次執行此腳本"
    exit 0
fi

# 推送代碼
echo ""
echo "📤 推送代碼到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功！你的代碼已經推送到 GitHub！"
    echo ""
    echo "🔗 Repository URL: https://github.com/$GITHUB_USERNAME/iris-immersive-translate"
    echo ""
    echo "下一步："
    echo "1. 前往 repository 設置添加 topics (chrome-extension, translation, ollama, ai, privacy)"
    echo "2. 添加 LICENSE 文件（MIT License）"
    echo "3. 在社交媒體分享你的專案！"
    echo ""
else
    echo ""
    echo "❌ 推送失敗。可能的原因："
    echo "   - Repository 不存在"
    echo "   - 沒有權限"
    echo "   - 需要身份驗證（對於 HTTPS）"
    echo ""
    echo "請檢查錯誤訊息並重試。"
    echo ""
    echo "💡 提示：如果使用 HTTPS，你可能需要使用 Personal Access Token"
    echo "   前往: https://github.com/settings/tokens"
fi
