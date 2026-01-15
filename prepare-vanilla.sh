#!/bin/bash

# Dr. Spill - Prepare Vanilla Files for Deployment
# This script copies the necessary files to a deployment folder

echo "🏥 Dr. Spill - Preparing vanilla files for deployment..."

# Create deployment directory
DEPLOY_DIR="dr-spill-vanilla"
mkdir -p "$DEPLOY_DIR"

# Copy essential files
echo "📋 Copying files..."
cp index.html "$DEPLOY_DIR/"
cp styles.css "$DEPLOY_DIR/"
cp script.js "$DEPLOY_DIR/"

# Check if logo exists and copy it
if [ -f "logo.png" ]; then
    cp logo.png "$DEPLOY_DIR/"
    echo "✓ Logo copied"
else
    echo "⚠️  Warning: logo.png not found. Please add your logo to the deployment folder."
fi

# Copy documentation
cp VANILLA-SETUP.md "$DEPLOY_DIR/README.md"

# Create .nojekyll for GitHub Pages
touch "$DEPLOY_DIR/.nojekyll"

echo ""
echo "✅ Files prepared successfully!"
echo ""
echo "📁 Deployment files are in: ./$DEPLOY_DIR/"
echo ""
echo "Next steps:"
echo "1. Add your logo.png to the $DEPLOY_DIR folder"
echo "2. (Optional) Configure Supabase credentials in $DEPLOY_DIR/script.js"
echo "3. Deploy the $DEPLOY_DIR folder to GitHub Pages or any web host"
echo ""
echo "🚀 Ready to deploy!"
