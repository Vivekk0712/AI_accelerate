# 🚀 Deployment Guide - Render + Netlify

Complete guide to deploy your AI Assistant application to production.

---

## 📋 Prerequisites

- GitHub account (to connect repositories)
- Render account (free tier available)
- Netlify account (free tier available)
- All environment variables ready

---

## 🗂️ Project Structure

```
Your App
├── Backend (Node.js)     → Deploy to Render
├── MCP Server (Python)   → Deploy to Render
└── Frontend (React)      → Deploy to Netlify
```

---

## 🔧 Part 1: Prepare for Deployment

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### 2. Prepare Firebase Service Account

**Important:** Don't commit `serviceAccount.json` to GitHub!

**Option A: Use Environment Variable (Recommended)**
```bash
# Convert serviceAccount.json to base64
# Windows PowerShell:
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("backend/serviceAccount.json"))

# Linux/Mac:
base64 backend/serviceAccount.json
```

**Option B: Use Render Secret Files**
We'll upload it directly in Render dashboard.

---

## 🐍 Part 2: Deploy MCP Server (Python) to Render

### Step 1: Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

### Step 2: Configure Service

**Basic Settings:**
- **Name:** `ai-assistant-mcp-server`
- **Region:** Oregon (US West) or closest to you
- **Branch:** `main`
- **Root Directory:** `mcp_server`
- **Environment:** `Python 3`
- **Build Command:** `pip install -r requirements-prod.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Plan:**
- Select **"Starter"** ($7/month) or **"Free"** (with limitations)

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

```env
GEMINI_API_KEY=your-gemini-api-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET_KEY=your-secret-key-change-this
ELASTICSEARCH_ENDPOINT=https://your-project.es.region.gcp.elastic.cloud:443
ELASTICSEARCH_API_KEY=your-elasticsearch-api-key
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Note your MCP Server URL: `https://ai-assistant-mcp-server.onrender.com`

### Step 5: Verify Deployment

```bash
# Test health endpoint
curl https://ai-assistant-mcp-server.onrender.com/health
# Should return: {"status":"ok"}
```

---

## 🟢 Part 3: Deploy Backend (Node.js) to Render

### Step 1: Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

### Step 2: Configure Service

**Basic Settings:**
- **Name:** `ai-assistant-backend`
- **Region:** Oregon (US West) or closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Plan:**
- Select **"Starter"** ($7/month) or **"Free"** (with limitations)

### Step 3: Add Environment Variables

```env
NODE_ENV=production
PORT=4000
FIREBASE_PROJECT_ID=your-project-id
SESSION_COOKIE_NAME=__session
SESSION_EXPIRES_IN=432000000
MCP_SERVER_URL=https://ai-assistant-mcp-server.onrender.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 4: Add Firebase Service Account

**Option A: Environment Variable**
```env
GOOGLE_APPLICATION_CREDENTIALS_JSON=<base64-encoded-json>
```

Then update `backend/src/firebase.js`:
```javascript
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON 
  ? JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON, 'base64').toString())
  : require('./serviceAccount.json');
```

**Option B: Secret Files (Recommended)**
1. In Render dashboard, go to **"Environment"** tab
2. Scroll to **"Secret Files"**
3. Click **"Add Secret File"**
4. **Filename:** `serviceAccount.json`
5. **Contents:** Paste your serviceAccount.json content
6. Save

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Note your Backend URL: `https://ai-assistant-backend.onrender.com`

### Step 6: Update CORS

Update `backend/src/index.js`:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-app.netlify.app', // Add your Netlify URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

Commit and push to trigger redeployment.

---

## 🎨 Part 4: Deploy Frontend to Netlify

### Step 1: Build Configuration

Create `frontend/netlify.toml` (already created above)

### Step 2: Update Environment Variables

Create `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://ai-assistant-backend.onrender.com
VITE_APP_ID=ai-assistant-production

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-key
```

### Step 3: Deploy to Netlify

**Option A: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend
netlify deploy --prod
```

**Option B: Netlify Dashboard**

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub
4. Select your repository
5. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
6. Click **"Deploy site"**

### Step 4: Add Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Add all variables from `.env.production`
3. Click **"Save"**

### Step 5: Configure Domain (Optional)

1. Go to **Domain settings**
2. Add custom domain or use Netlify subdomain
3. Note your URL: `https://your-app.netlify.app`

### Step 6: Redeploy

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**

---

## 🔐 Part 5: Update Firebase Configuration

### 1. Add Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add:
   - `your-app.netlify.app`
   - `ai-assistant-backend.onrender.com`

### 2. Update OAuth Redirect URIs

For Google Sign-In:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Edit OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs:**
   - `https://your-app.netlify.app/__/auth/handler`
   - `https://your-project.firebaseapp.com/__/auth/handler`

---

## ✅ Part 6: Verify Deployment

### 1. Test MCP Server
```bash
curl https://ai-assistant-mcp-server.onrender.com/health
```

### 2. Test Backend
```bash
curl https://ai-assistant-backend.onrender.com/api/me
```

### 3. Test Frontend
1. Open `https://your-app.netlify.app`
2. Try to sign in
3. Upload a document
4. Send a chat message

---

## 🐛 Troubleshooting

### MCP Server Issues

**Problem:** Server not starting
```bash
# Check logs in Render dashboard
# Common issues:
# - Missing environment variables
# - Python version mismatch
# - Dependencies not installed
```

**Solution:**
- Verify all environment variables are set
- Check build logs for errors
- Ensure `requirements-prod.txt` is correct

### Backend Issues

**Problem:** CORS errors
```javascript
// Update backend/src/index.js
const corsOptions = {
  origin: [
    'https://your-app.netlify.app',
    'https://ai-assistant-backend.onrender.com'
  ],
  credentials: true
};
```

**Problem:** Firebase auth not working
- Verify `serviceAccount.json` is uploaded correctly
- Check Firebase authorized domains
- Verify environment variables

### Frontend Issues

**Problem:** API calls failing
- Check `VITE_API_BASE_URL` in Netlify environment variables
- Verify backend CORS settings
- Check browser console for errors

**Problem:** Build failing
```bash
# Check build logs in Netlify
# Common issues:
# - Missing dependencies
# - TypeScript errors
# - Environment variables not set
```

---

## 💰 Cost Breakdown

### Option 1: FREE Tier (For Testing/Demos)

**Render Free Tier:**
- **MCP Server:** FREE ⚠️ (spins down after 15 min)
- **Backend:** FREE ⚠️ (spins down after 15 min)
- **Limitations:**
  - Cold starts (30-60 seconds)
  - 512 MB RAM per service
  - Spins down when inactive
  - 750 hours/month per service

**Netlify:**
- **Frontend:** FREE (100GB bandwidth)

**External Services:**
- **Firebase:** FREE tier (50K reads/day)
- **Supabase:** FREE tier (500MB database)
- **Elasticsearch:** ~$95/month (Serverless) OR FREE self-hosted
- **Gemini API:** Pay per use (~$0.001 per request)

**Total Monthly Cost (Free Tier):** $0-100/month
- $0 if using self-hosted Elasticsearch
- ~$95 if using Elasticsearch Cloud

### Option 2: Paid Tier (For Production)

**Render Starter Plan:**
- **MCP Server:** $7/month
- **Backend:** $7/month
- **Benefits:**
  - Always on (no cold starts)
  - 512 MB RAM
  - Better performance

**Netlify:**
- **Frontend:** FREE (100GB bandwidth)

**External Services:**
- **Firebase:** FREE tier (50K reads/day)
- **Supabase:** FREE tier (500MB database)
- **Elasticsearch:** ~$95/month (Serverless)
- **Gemini API:** Pay per use (~$0.001 per request)

**Total Monthly Cost (Paid):** ~$110-120/month

### Recommendation by Use Case

**For Hackathon/Demo:**
- ✅ Use FREE tier on Render
- ✅ Accept cold starts
- ✅ Total cost: $0-100/month

**For Production:**
- ✅ Use Starter plan on Render
- ✅ No cold starts
- ✅ Better reliability
- ✅ Total cost: ~$110-120/month

**For Development:**
- ✅ Run locally (FREE)
- ✅ No deployment costs

---

## 🚀 Optimization Tips

### 1. Enable Caching
```javascript
// In backend
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});
```

### 2. Use CDN
Netlify automatically uses CDN for frontend.

### 3. Compress Responses
```bash
# Install compression
npm install compression

# In backend/src/index.js
const compression = require('compression');
app.use(compression());
```

### 4. Monitor Performance
- Use Render metrics dashboard
- Use Netlify analytics
- Set up error tracking (Sentry)

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push

**Render:**
- Automatically deploys on push to `main` branch
- Can configure branch in dashboard

**Netlify:**
- Automatically deploys on push to `main` branch
- Can configure in **Build & deploy** settings

### Manual Deploy

**Render:**
```bash
# Trigger manual deploy from dashboard
# Or use Render API
```

**Netlify:**
```bash
netlify deploy --prod
```

---

## 📊 Monitoring

### Render Dashboard
- View logs in real-time
- Monitor CPU/Memory usage
- Set up alerts

### Netlify Analytics
- View traffic stats
- Monitor build times
- Check error rates

### Application Monitoring
```bash
# Add logging
npm install winston

# Add error tracking
npm install @sentry/node
```

---

## 🔒 Security Checklist

- [ ] All environment variables set correctly
- [ ] Firebase authorized domains updated
- [ ] CORS configured properly
- [ ] HTTPS enabled (automatic on Render/Netlify)
- [ ] Secret files not committed to Git
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] Error messages don't expose sensitive info

---

## 📝 Post-Deployment

### 1. Update README
Add deployment URLs to your README.md

### 2. Test All Features
- Authentication (Email, Google, Phone)
- File upload
- Chat functionality
- Image upload
- Admin dashboard

### 3. Monitor Logs
- Check for errors
- Monitor performance
- Set up alerts

### 4. Backup Data
- Export Supabase data regularly
- Backup Elasticsearch indices
- Keep Firebase config safe

---

## 🎉 You're Live!

Your AI Assistant is now deployed and accessible at:
- **Frontend:** `https://your-app.netlify.app`
- **Backend:** `https://ai-assistant-backend.onrender.com`
- **MCP Server:** `https://ai-assistant-mcp-server.onrender.com`

**Next Steps:**
1. Share with users
2. Monitor performance
3. Gather feedback
4. Iterate and improve

---

**Need help?** Check the troubleshooting section or open an issue on GitHub.
