#!/bin/sh

# Complete build script for the icons package
# This script handles all prebuild and build steps

set -e  # Exit on any error

# Cleanup function to run on exit
cleanup() {
    echo "🧹 Cleaning up temporary files..."
    rm -rf temp
    echo "🧹 Cleaning up generated source files..."
    rm -f src/icons.ts
    rm -f src/index.d.ts
}

# Set up trap to run cleanup on exit (success or failure)
trap cleanup EXIT

echo "🚀 Starting icons package build..."

# Step 1: Generate icons.ts from SVG assets
echo "📦 Generating icons.ts from SVG assets..."
node src/generateIcons.ts

# Step 2: Generate TypeScript type declarations
echo "🔨 Generating TypeScript type declarations..."
pnpm tsc --project tsconfig.build-scripts.json
node -e "import('./temp/generateTypes.js').then(m => m.generateIconTypes())"

# Step 3: Compile TypeScript to JavaScript
echo "⚙️  Compiling TypeScript to JavaScript..."
pnpm tsc --project tsconfig.build.json

echo "✅ Build complete! All files generated successfully."