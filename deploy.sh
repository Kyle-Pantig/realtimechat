#!/bin/bash

echo "🚀 Real-Time Chat Deployment Script"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    exit 1
fi

# Check if changes exist
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ No changes to commit"
else
    echo "📝 Committing changes..."
    git add .
    git commit -m "Deploy to production $(date)"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. 🌐 Deploy Frontend to Vercel:"
echo "   - Go to vercel.com"
echo "   - Import your GitHub repository"
echo "   - Deploy automatically"
echo ""
echo "2. 🔌 Deploy Socket.IO Server to Railway:"
echo "   - Go to railway.app"
echo "   - Create new project from GitHub"
echo "   - Set environment variables:"
echo "     NODE_ENV=production"
echo "     PORT=3001"
echo "     FRONTEND_URL=https://your-app.vercel.app"
echo ""
echo "3. 🔧 Update Frontend Configuration:"
echo "   - Update src/hooks/useSocket.ts with Railway URL"
echo "   - Push changes to trigger Vercel redeploy"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "✨ Happy Deploying!"
