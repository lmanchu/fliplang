#!/bin/bash
#
# GitHub Repository 更名腳本
# 從 iris-immersive-translate → fliplang
#
# 需要: GitHub Personal Access Token with 'repo' scope
# 獲取 token: https://github.com/settings/tokens
#

set -e

REPO_OWNER="lmanchu"
OLD_REPO_NAME="iris-immersive-translate"
NEW_REPO_NAME="fliplang"
NEW_DESCRIPTION="Privacy-first translation Chrome extension: Fast Google Translate + Local AI (Ollama). Hover, select, or translate entire pages."

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔄 GitHub Repository 更名工具"
echo "================================"
echo ""
echo "這個腳本會幫你："
echo "  1. 改名 repository: $OLD_REPO_NAME → $NEW_REPO_NAME"
echo "  2. 更新 description"
echo "  3. 添加 topics"
echo "  4. 更新本地 git remote URL"
echo ""

# 檢查是否提供 token
if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ 錯誤: 未找到 GITHUB_TOKEN 環境變量${NC}"
    echo ""
    echo "請先設置你的 GitHub Personal Access Token:"
    echo "  1. 前往: https://github.com/settings/tokens"
    echo "  2. 點擊 'Generate new token (classic)'"
    echo "  3. 勾選 'repo' scope"
    echo "  4. 複製生成的 token"
    echo "  5. 執行: export GITHUB_TOKEN='your_token_here'"
    echo "  6. 再次運行此腳本"
    echo ""
    exit 1
fi

echo -e "${YELLOW}⚠️  即將執行以下操作：${NC}"
echo "  Repository: https://github.com/$REPO_OWNER/$OLD_REPO_NAME"
echo "  新名稱: $NEW_REPO_NAME"
echo ""
read -p "確認繼續? (y/N): " confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "已取消操作"
    exit 0
fi

echo ""
echo "📝 步驟 1: 更新 repository 名稱和描述..."

# 使用 GitHub API 更新 repository
response=$(curl -s -w "\n%{http_code}" \
    -X PATCH \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    https://api.github.com/repos/$REPO_OWNER/$OLD_REPO_NAME \
    -d "{\"name\":\"$NEW_REPO_NAME\",\"description\":\"$NEW_DESCRIPTION\"}")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✅ Repository 已成功更名為: $NEW_REPO_NAME${NC}"
else
    echo -e "${RED}❌ 更名失敗 (HTTP $http_code)${NC}"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
    exit 1
fi

echo ""
echo "🏷️  步驟 2: 添加 topics..."

# 添加 topics
topics='["chrome-extension","translation","privacy","ollama","ai","google-translate","bilingual","productivity"]'

curl -s -X PUT \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    https://api.github.com/repos/$REPO_OWNER/$NEW_REPO_NAME/topics \
    -d "{\"names\":$topics}" > /dev/null

echo -e "${GREEN}✅ Topics 已添加${NC}"

echo ""
echo "🔗 步驟 3: 更新本地 git remote URL..."

# 更新本地 git remote
cd "$(dirname "$0")"
git remote set-url origin https://github.com/$REPO_OWNER/$NEW_REPO_NAME.git

echo -e "${GREEN}✅ 本地 remote URL 已更新${NC}"

echo ""
echo "🎉 完成！Repository 更名成功"
echo ""
echo "新的 repository URL: https://github.com/$REPO_OWNER/$NEW_REPO_NAME"
echo ""
echo "注意: GitHub 會自動設置重定向，舊 URL 仍然可用"
