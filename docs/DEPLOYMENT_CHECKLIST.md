# ✅ Deployment Checklist

Quick checklist to ensure smooth deployment.

## 📋 Pre-Deployment

### Code Preparation
- [ ] All code committed to Git
- [ ] `.gitignore` includes sensitive files
- [ ] `serviceAccount.json` NOT in Git
- [ ] All dependencies listed in `package.json` / `requirements-prod.txt`
- [ ] Environment variables documented

### Configuration Files Created
- [ ] `backend/render.yaml`
- [ ] `mcp_server/render.yaml`
- [ ] `frontend/netlify.toml`
- [ ] `frontend/.env.production`

### GitHub
- [ ] Repository created
- [ ] Code pushed to `main` branch
- [ ] Repository is public or Render/Netlify has access

## 🐍 MCP Server Deployment

### Render Setup
- [ ] New Web Service created
- [ ] Repository connected
- [ ] Root directory set to `mcp_server`
- [ ] Python 3 environment selected
- [ ] Build command: `pip install -r requirements-prod.txt`
- [ ] Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Environment Variables
- [ ] `GEMINI_API_KEY`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `JWT_SECRET_KEY`
- [ ] `ELASTICSEARCH_ENDPOINT`
- [ ] `ELASTICSEARCH_API_KEY`

### Verification
- [ ] Deployment successful
- [ ] Health check works: `/health`
- [ ] URL noted: `https://_____.onrender.com`

## 🟢 Backend Deployment

### Render Setup
- [ ] New Web Service created
- [ ] Repository connected
- [ ] Root directory set to `backend`
- [ ] Node environment selected
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=4000`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `SESSION_COOKIE_NAME`
- [ ] `SESSION_EXPIRES_IN`
- [ ] `MCP_SERVER_URL` (from step above)
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### Firebase Service Account
- [ ] `serviceAccount.json` uploaded as Secret File
- OR
- [ ] Base64 encoded and added as env var

### CORS Configuration
- [ ] Netlify URL added to CORS origins
- [ ] Code committed and pushed

### Verification
- [ ] Deployment successful
- [ ] API responds
- [ ] URL noted: `https://_____.onrender.com`

## 🎨 Frontend Deployment

### Netlify Setup
- [ ] New site created
- [ ] Repository connected
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/dist`

### Environment Variables
- [ ] `VITE_API_BASE_URL` (Backend URL)
- [ ] `VITE_APP_ID`
- [ ] `VITE_FIREBASE_API_KEY`
- [ ] `VITE_FIREBASE_AUTH_DOMAIN`
- [ ] `VITE_FIREBASE_PROJECT_ID`
- [ ] `VITE_FIREBASE_APP_ID`
- [ ] `VITE_RECAPTCHA_SITE_KEY`

### Verification
- [ ] Build successful
- [ ] Site accessible
- [ ] URL noted: `https://_____.netlify.app`

## 🔐 Firebase Configuration

### Authorized Domains
- [ ] Netlify domain added
- [ ] Render backend domain added

### OAuth Configuration
- [ ] Google OAuth redirect URIs updated
- [ ] Includes Netlify URL

## 🧪 Testing

### Authentication
- [ ] Email/Password login works
- [ ] Google Sign-In works
- [ ] Phone OTP works

### Core Features
- [ ] File upload works
- [ ] Chat functionality works
- [ ] Image upload works
- [ ] Chat history persists

### Admin Features
- [ ] Admin login works
- [ ] File management works
- [ ] User management works

## 📊 Monitoring

### Setup
- [ ] Render logs accessible
- [ ] Netlify analytics enabled
- [ ] Error tracking configured (optional)

### Health Checks
- [ ] MCP Server health endpoint
- [ ] Backend API responding
- [ ] Frontend loading correctly

## 🔒 Security

### Verification
- [ ] HTTPS enabled (automatic)
- [ ] Environment variables secure
- [ ] No secrets in Git
- [ ] CORS properly configured
- [ ] Firebase domains authorized

## 📝 Documentation

### Updates
- [ ] README updated with deployment URLs
- [ ] Environment variables documented
- [ ] Deployment guide accessible

## 🎉 Go Live

### Final Steps
- [ ] All tests passing
- [ ] Performance acceptable
- [ ] No errors in logs
- [ ] Team notified
- [ ] Users can access

---

## 📞 Support

If any step fails:
1. Check deployment logs
2. Verify environment variables
3. Review DEPLOYMENT_GUIDE.md
4. Check troubleshooting section

---

**Deployment Date:** _____________
**Deployed By:** _____________
**URLs:**
- Frontend: _____________
- Backend: _____________
- MCP Server: _____________
