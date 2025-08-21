# 🚀 Deployment Guide

This guide covers deploying your real-time chat application to production.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway/Render account (free tiers available)
- Node.js 18+ knowledge

## 🎯 Deployment Options

### Option 1: Vercel + Railway (Recommended for beginners)

**Frontend**: Vercel (free)
**Backend**: Railway ($5/month, free tier available)

### Option 2: Vercel + Render

**Frontend**: Vercel (free)
**Backend**: Render (free tier)

### Option 3: Full-stack on Railway

**Both**: Railway (starts at $5/month)

### Option 4: Self-hosted (VPS)

**Both**: DigitalOcean, AWS EC2, etc.

## 🔧 Step-by-Step Deployment

### Step 1: Deploy Frontend to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Deploy

3. **Configure Vercel**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Get your Vercel URL**
   - Note your deployment URL (e.g., `https://your-app.vercel.app`)

### Step 2: Deploy Socket.IO Server to Railway

1. **Go to Railway**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Configure Railway**
   - Set Root Directory to `/` (root of repo)
   - Build Command: `npm install`
   - Start Command: `npm run start:production`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://your-app.vercel.app
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Get your server URL (e.g., `https://your-server.railway.app`)

### Step 3: Update Frontend Configuration

1. **Update Socket.IO connection**
   - In `src/hooks/useSocket.ts`, change:
   ```typescript
   const newSocket = io('https://your-server.railway.app');
   ```

2. **Redeploy Frontend**
   - Push changes to GitHub
   - Vercel will auto-deploy

## 🐳 Docker Deployment (Alternative)

### Local Docker Testing
```bash
# Build and run with Docker
npm run docker:build
npm run docker:run

# Or use Docker Compose
npm run docker:compose
```

### Deploy to Railway with Docker
1. Railway automatically detects Dockerfile
2. No additional configuration needed
3. Uses the production server configuration

## 🌐 Environment Variables

### Frontend (Vercel)
```
NEXT_PUBLIC_SOCKET_URL=https://your-server.railway.app
```

### Backend (Railway/Render)
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-app.vercel.app
```

## 📱 Production Checklist

- [ ] Frontend deployed to Vercel
- [ ] Socket.IO server deployed to Railway/Render
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] SSL certificates active
- [ ] Domain configured (optional)
- [ ] Monitoring set up (optional)

## 🔒 Security Considerations

### CORS Configuration
- Update `FRONTEND_URL` in production
- Restrict origins to your domain only

### Rate Limiting
- Consider adding rate limiting for production
- Implement user authentication

### SSL/TLS
- Both Vercel and Railway provide SSL
- Ensure HTTPS connections

## 📊 Monitoring & Scaling

### Basic Monitoring
- Railway/Render provide basic logs
- Vercel shows frontend performance

### Scaling Options
- **Horizontal**: Deploy multiple Socket.IO instances
- **Vertical**: Upgrade Railway plan
- **Redis**: Add Redis adapter for multiple servers

### Redis Setup (Advanced)
```bash
# Install Redis adapter
npm install @socket.io/redis-adapter redis

# Update server-production.js to use Redis
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `FRONTEND_URL` environment variable
   - Verify CORS configuration in server

2. **Connection Failed**
   - Check if server is running
   - Verify environment variables
   - Check Railway logs

3. **Build Failures**
   - Ensure all dependencies are in `dependencies` (not `devDependencies`)
   - Check Node.js version compatibility

### Debug Commands
```bash
# Check server logs
railway logs

# Check environment variables
railway variables

# Restart service
railway service restart
```

## 💰 Cost Breakdown

### Free Tier
- **Vercel**: Free (unlimited deployments)
- **Railway**: $5/month (free tier available)
- **Render**: Free tier available

### Paid Options
- **Railway**: $5-20/month (scaling)
- **Vercel Pro**: $20/month (advanced features)
- **Self-hosted**: $5-50/month (VPS)

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Frontend loads at Vercel URL
- ✅ Socket.IO server responds at Railway URL
- ✅ Real-time chat works between users
- ✅ Typing indicators function properly
- ✅ No CORS errors in browser console

## 🚀 Next Steps

After successful deployment:
1. **Add custom domain** (optional)
2. **Set up monitoring** (optional)
3. **Add authentication** (recommended)
4. **Implement user management**
5. **Add file sharing** (optional)

## 📞 Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Railway**: [railway.app/docs](https://railway.app/docs)
- **Render**: [render.com/docs](https://render.com/docs)

---

**Happy Deploying! 🚀✨**
