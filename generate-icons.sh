#!/bin/bash

# Iris Immersive Translate - Icon Generator
# 使用 ImageMagick 將 SVG 轉換成 PNG

echo "🎨 Generating icons..."

# 檢查 ImageMagick 是否安裝
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing..."

    # 嘗試使用 Homebrew 安裝
    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo "⚠️  Please install ImageMagick manually:"
        echo "   brew install imagemagick"
        echo "   或訪問: https://imagemagick.org/script/download.php"
        exit 1
    fi
fi

cd "$(dirname "$0")/icons"

# 轉換 SVG 到不同尺寸的 PNG
for size in 16 48 128; do
    echo "  Generating icon${size}.png..."
    convert icon.svg -resize ${size}x${size} icon${size}.png
done

echo "✅ Icons generated successfully!"
echo ""
echo "Generated files:"
ls -lh icon*.png
