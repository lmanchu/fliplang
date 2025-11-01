#!/bin/bash

echo "🔍 Iris Immersive Translate - 診斷工具"
echo "========================================"
echo ""

# 1. 檢查 Ollama 運行狀態
echo "1️⃣ 檢查 Ollama 運行狀態..."
if pgrep -x "ollama" > /dev/null; then
    echo "   ✓ Ollama 正在運行"
else
    echo "   ✗ Ollama 沒有運行"
    echo "   🔧 請執行: OLLAMA_ORIGINS=\"*\" ollama serve"
    exit 1
fi

# 2. 檢查 Ollama API
echo ""
echo "2️⃣ 檢查 Ollama API..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "   ✓ Ollama API 可以訪問"
else
    echo "   ✗ 無法訪問 Ollama API"
    exit 1
fi

# 3. 列出可用模型
echo ""
echo "3️⃣ 可用的模型..."
MODELS=$(curl -s http://localhost:11434/api/tags | python3 -c "import sys, json; print(', '.join([m['name'] for m in json.load(sys.stdin)['models']]))")
echo "   $MODELS"

# 4. 檢查 CORS 設定
echo ""
echo "4️⃣ 測試 CORS（跨域請求）..."
# 這個測試需要在瀏覽器環境中進行
echo "   ⚠️  請在瀏覽器中打開 test-ollama-cors.html 來測試 CORS"

# 5. 檢查 Extension 檔案
echo ""
echo "5️⃣ 檢查 Extension 檔案..."

cd /Users/lman/iris-immersive-translate

# 檢查 manifest.json
if python3 -m json.tool manifest.json > /dev/null 2>&1; then
    echo "   ✓ manifest.json 語法正確"
else
    echo "   ✗ manifest.json 語法錯誤"
fi

# 檢查圖標
for size in 16 48 128; do
    if [ -f "icons/icon${size}.png" ]; then
        echo "   ✓ icon${size}.png 存在"
    else
        echo "   ✗ icon${size}.png 缺失"
    fi
done

# 檢查主要檔案
for file in background.js content.js popup.html popup.js styles/translate.css; do
    if [ -f "$file" ]; then
        echo "   ✓ $file 存在"
    else
        echo "   ✗ $file 缺失"
    fi
done

# 6. 檢查環境變數
echo ""
echo "6️⃣ 檢查環境變數..."
if [ -z "$OLLAMA_ORIGINS" ]; then
    echo "   ⚠️  OLLAMA_ORIGINS 未設定"
    echo "   🔧 重新啟動 Ollama: killall ollama && OLLAMA_ORIGINS=\"*\" ollama serve"
else
    echo "   ✓ OLLAMA_ORIGINS = $OLLAMA_ORIGINS"
fi

echo ""
echo "========================================"
echo "📊 診斷完成！"
echo ""
echo "下一步:"
echo "1. 在 BrowserOS 中打開 test-ollama-cors.html 測試 CORS"
echo "2. 在 Extension 設定中使用以下模型之一："
echo "   $MODELS"
echo "3. 如果 CORS 測試失敗，重新啟動 Ollama："
echo "   killall ollama"
echo "   OLLAMA_ORIGINS=\"*\" ollama serve"
echo ""
