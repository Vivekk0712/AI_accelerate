# Environment Variables Guide

Complete guide to all environment variables needed for NovaFuze-Tech with Elasticsearch integration.

---

## 📁 File Locations

```
NovaFuze-Tech/
├── backend/.env                    # Backend server config
├── NovaFuze_web/.env              # Frontend config
└── mcp_server/.env                # MCP server + Elasticsearch config
```

---

## 🔧 Backend Configuration

**File:** `backend/.env`

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json

# Session Configuration
SESSION_COOKIE_NAME=__session
SESSION_EXPIRES_IN=432000000

# Razorpay Configuration (Test Mode)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_business_email@gmail.com
EMAIL_PASS=your_16_character_app_password
EMAIL_FROM_NAME=NovaFuze-Tech
EMAIL_FROM_ADDRESS=your_business_email@gmail.com

# MCP Server
MCP_SERVER_URL=http://localhost:8000

# Supabase (for admin features)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### How to Get These Values:

**Firebase:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Project Settings → Service accounts
4. Generate new private key → Save as `serviceAccount.json`

**Razorpay:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Settings → API Keys
3. Generate Test/Live keys

**Email (Gmail):**
1. Enable 2FA on your Gmail account
2. Go to Security → App passwords
3. Generate app password for "Mail"

---

## 🌐 Frontend Configuration

**File:** `frontend/.env`

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:4000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### How to Get These Values:

**Firebase Web Config:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings → General
3. Your apps → Web app
4. Copy the config values

**reCAPTCHA:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/security/recaptcha)
2. Create reCAPTCHA v3 key
3. Copy the Site Key

---

## 🤖 MCP Server Configuration (with Elasticsearch)

**File:** `mcp_server/.env`

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# JWT Secret
JWT_SECRET_KEY=your_jwt_secret_key

# ============================================
# ELASTICSEARCH CONFIGURATION (NEW! 🎉)
# ============================================

# Option 1: Elastic Cloud (Recommended for Hackathon)
ELASTICSEARCH_CLOUD_ID=your_cloud_id_here
ELASTICSEARCH_API_KEY=your_api_key_here

# Option 2: Self-hosted Elasticsearch
# ELASTICSEARCH_HOSTS=http://localhost:9200

# Environment
NODE_ENV=development
```

### How to Get These Values:

**Supabase:**
1. Go to [Supabase Dashboard](https://app.supabase.io/)
2. Select your project
3. Settings → API
4. Copy Project URL and Service Role Key

**Gemini API:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Get API Key
3. Copy the key

**Elasticsearch Cloud:** ⭐ NEW!
1. Go to [Elastic Cloud](https://cloud.elastic.co)
2. Create account (free trial)
3. Create deployment
4. Copy Cloud ID and API Key

**Elasticsearch Self-hosted:**
```bash
# Run with Docker
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.12.0

# Then use:
ELASTICSEARCH_HOSTS=http://localhost:9200
```

---

## 🚀 Quick Setup for Hackathon

### Step 1: Copy Example Files

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env

# MCP Server
cp mcp_server/.env.example mcp_server/.env
```

### Step 2: Fill in Required Values

**Minimum Required for Demo:**

1. **Firebase** (authentication)
   - FIREBASE_PROJECT_ID
   - FIREBASE_API_KEY
   - serviceAccount.json file

2. **Supabase** (database & storage)
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY

3. **Gemini** (AI responses)
   - GEMINI_API_KEY

4. **Elasticsearch** (vector search) ⭐ NEW!
   - ELASTICSEARCH_CLOUD_ID
   - ELASTICSEARCH_API_KEY

**Optional for Full Features:**
- Razorpay (payments)
- Gmail (email notifications)

---

## 🔍 Elasticsearch Configuration Details

### Option 1: Elastic Cloud (Recommended)

**Pros:**
- ✅ Easy setup (5 minutes)
- ✅ Free trial available
- ✅ Managed service
- ✅ Automatic backups
- ✅ Kibana included

**Setup:**
```env
ELASTICSEARCH_CLOUD_ID=deployment:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGFiYzEyMw==
ELASTICSEARCH_API_KEY=VnVhQ2ZHY0JDZGJrUW0tZTVoT3o6dWkybHAyYXhUTm1zeWFrdzl0dk5oZw==
```

**Get Cloud ID:**
1. Elastic Cloud Console → Your deployment
2. Copy "Cloud ID"

**Get API Key:**
1. Elastic Cloud Console → Your deployment
2. Management → Stack Management → API Keys
3. Create API Key → Copy

### Option 2: Self-hosted (Docker)

**Pros:**
- ✅ Free
- ✅ Full control
- ✅ No internet required

**Cons:**
- ❌ Manual setup
- ❌ No managed backups
- ❌ Requires Docker

**Setup:**
```bash
# Start Elasticsearch
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.12.0

# Configure
ELASTICSEARCH_HOSTS=http://localhost:9200
```

---

## ✅ Verification

### Test Backend
```bash
cd backend
npm run dev
# Should see: ✅ Server running on port 4000
```

### Test Frontend
```bash
cd frontend
npm run dev
# Should see: ✅ Local: http://localhost:5173
```

### Test MCP Server
```bash
cd mcp_server
uvicorn main:app --reload
# Should see:
# ✅ Supabase client initialized
# ✅ Elasticsearch initialized (Cloud)
# ✅ Created index 'documents'
```

### Test Elasticsearch Connection
```bash
cd mcp_server
python test_elasticsearch_integration.py
# Should see: 7/7 tests passed ✅
```

---

## 🐛 Troubleshooting

### "Elasticsearch not initialized"

**Check:**
```bash
# Verify environment variables
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('ELASTICSEARCH_CLOUD_ID:', 'SET' if os.getenv('ELASTICSEARCH_CLOUD_ID') else 'NOT SET')
print('ELASTICSEARCH_API_KEY:', 'SET' if os.getenv('ELASTICSEARCH_API_KEY') else 'NOT SET')
"
```

**Fix:**
1. Make sure `.env` file exists in `mcp_server/`
2. Check for typos in variable names
3. Ensure no extra spaces around `=`
4. Restart the server after changes

### "Supabase connection failed"

**Check:**
```bash
python -c "
from supabase_client import init_supabase
import os
from dotenv import load_dotenv
load_dotenv()
supabase = init_supabase(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_ROLE_KEY')
)
print('✅ Connected' if supabase else '❌ Failed')
"
```

### "Firebase authentication error"

**Check:**
1. `serviceAccount.json` exists in `backend/` directory
2. File has correct permissions
3. FIREBASE_PROJECT_ID matches the file

---

## 📋 Environment Variables Checklist

### Backend
- [ ] PORT
- [ ] FIREBASE_PROJECT_ID
- [ ] GOOGLE_APPLICATION_CREDENTIALS
- [ ] SESSION_COOKIE_NAME
- [ ] SESSION_EXPIRES_IN
- [ ] MCP_SERVER_URL
- [ ] RAZORPAY_KEY_ID (optional)
- [ ] RAZORPAY_KEY_SECRET (optional)
- [ ] EMAIL_* variables (optional)

### Frontend
- [ ] VITE_API_BASE_URL
- [ ] VITE_FIREBASE_API_KEY
- [ ] VITE_FIREBASE_AUTH_DOMAIN
- [ ] VITE_FIREBASE_PROJECT_ID
- [ ] VITE_FIREBASE_APP_ID
- [ ] VITE_RECAPTCHA_SITE_KEY

### MCP Server
- [ ] SUPABASE_URL
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] GEMINI_API_KEY
- [ ] JWT_SECRET_KEY
- [ ] ELASTICSEARCH_CLOUD_ID ⭐ NEW!
- [ ] ELASTICSEARCH_API_KEY ⭐ NEW!

---

## 🎯 Minimal Setup for Demo

If you're short on time, here's the absolute minimum:

```env
# mcp_server/.env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_key
GEMINI_API_KEY=your_gemini_key
JWT_SECRET_KEY=any_random_string
ELASTICSEARCH_CLOUD_ID=your_cloud_id
ELASTICSEARCH_API_KEY=your_api_key

# backend/.env
PORT=4000
FIREBASE_PROJECT_ID=your_project
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json
MCP_SERVER_URL=http://localhost:8000

# frontend/.env
VITE_API_BASE_URL=http://localhost:4000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_PROJECT_ID=your_project
```

This gives you:
- ✅ Authentication
- ✅ File upload
- ✅ AI chat
- ✅ Elasticsearch search

---

## 🔐 Security Notes

### Development
- ✅ Use `.env` files (gitignored)
- ✅ Never commit credentials
- ✅ Use test/development keys

### Production
- ✅ Use environment variables (not files)
- ✅ Use production keys
- ✅ Enable security features
- ✅ Rotate keys regularly

---

## 📚 Additional Resources

- **Elasticsearch Setup:** `mcp_server/ELASTICSEARCH_SETUP.md`
- **Quick Start:** `QUICK_START_SUMMARY.md`
- **Hackathon Guide:** `mcp_server/HACKATHON_QUICK_START.md`
- **Main README:** `README.md`

---

**Need help?** Check the troubleshooting sections in the respective setup guides!
