#!/bin/sh

# Exit on any error
set -e

# Enable verbose output
set -x

# Function to handle cleanup on failure
cleanup() {
    echo "Build failed. Cleaning up..."
    pnpm run clean 2>/dev/null || true
    exit 1
}

# Set up error trap
trap cleanup ERR

echo "🚀 Starting build process..."

echo "📦 Generating tokens..."
pnpm run generate

echo "🔨 Compiling TypeScript..."
pnpm run compile

echo "📋 Copying generated files..."
# Check if output files exist before copying
if [ ! -d "output" ]; then
    echo "❌ Error: output directory not found"
    exit 1
fi

if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found"
    exit 1
fi

# Copy files if they exist
if ls output/*.css output/*.js output/*.ts >/dev/null 2>&1; then
    cp output/*.css output/*.js output/*.ts dist/
    echo "✅ Generated files copied successfully"
else
    echo "❌ Error: No generated files found in output directory"
    exit 1
fi

echo "🧹 Cleaning up temporary files..."
pnpm run clean

echo "✅ Build completed successfully!"