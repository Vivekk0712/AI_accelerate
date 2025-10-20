# Elasticsearch Serverless Setup Guide

Quick guide for setting up Elasticsearch Serverless deployment.

---

## 🚀 What is Elasticsearch Serverless?

Elasticsearch Serverless is a fully managed, auto-scaling deployment option that:
- ✅ Automatically scales based on usage
- ✅ No infrastructure management needed
- ✅ Pay only for what you use
- ✅ Faster setup than hosted deployments
- ✅ Perfect for hackathons and demos

---

## 📋 Setup Steps

### 1. Create Elasticsearch Serverless Project

1. Go to [Elastic Cloud Console](https://cloud.elastic.co)
2. Click "Create project" or "Create deployment"
3. Select **"Serverless"** option
4. Choose your project type: **"Elasticsearch"**
5. Select region (choose closest to you)
6. Click "Create project"

### 2. Get Your Credentials

After creation, you'll see:

**Endpoint URL:**
```
https://your-project-id.es.us-central1.gcp.elastic-cloud.com
```

**API Key:**
```
Your_Base64_Encoded_API_Key_Here
```

**Important:** Save both immediately! The API key is only shown once.

### 3. Configure Your Application

Add to `mcp_server/.env`:

```env
# Elasticsearch Serverless Configuration
ELASTICSEARCH_ENDPOINT=https://your-project-id.es.us-central1.gcp.elastic-cloud.com
ELASTICSEARCH_API_KEY=Your_Base64_Encoded_API_Key_Here
```

**Note:** Use `ELASTICSEARCH_ENDPOINT` (not `ELASTICSEARCH_CLOUD_ID`) for serverless deployments.

---

## 🧪 Test Connection

```bash
cd mcp_server

# Test connection
python -c "
from elasticsearch_client import init_elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()
init_elasticsearch(
    endpoint=os.getenv('ELASTICSEARCH_ENDPOINT'),
    api_key=os.getenv('ELASTICSEARCH_API_KEY')
)
print('✅ Connected to Elasticsearch Serverless!')
"
```

**Expected output:**
```
Connecting to Elasticsearch Serverless at https://your-project...
✅ Elasticsearch connected successfully
✅ Created index 'documents' with vector search support
✅ Connected to Elasticsearch Serverless!
```

---

## 🔧 Configuration Comparison

### Serverless (Your Setup)
```env
ELASTICSEARCH_ENDPOINT=https://your-project.es.region.gcp.elastic-cloud.com
ELASTICSEARCH_API_KEY=your_api_key
```

### Hosted Cloud (Alternative)
```env
ELASTICSEARCH_CLOUD_ID=deployment:base64string
ELASTICSEARCH_API_KEY=your_api_key
```

### Self-Hosted (Alternative)
```env
ELASTICSEARCH_HOSTS=http://localhost:9200
```

---

## 🎯 Quick Start Commands

### Install Dependencies
```bash
pip install elasticsearch==8.12.0
```

### Run Tests
```bash
python test_elasticsearch_integration.py
```

### Start Server
```bash
uvicorn main:app --reload
```

### Check Stats
```bash
python -c "
from elasticsearch_client import get_index_stats, init_elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()
init_elasticsearch(
    endpoint=os.getenv('ELASTICSEARCH_ENDPOINT'),
    api_key=os.getenv('ELASTICSEARCH_API_KEY')
)
print(get_index_stats())
"
```

---

## 🔍 Verify Setup

### 1. Check Environment Variables
```bash
python -c "
import os
from dotenv import load_dotenv

load_dotenv()
endpoint = os.getenv('ELASTICSEARCH_ENDPOINT')
api_key = os.getenv('ELASTICSEARCH_API_KEY')

print(f'Endpoint: {endpoint[:50]}...' if endpoint else 'Endpoint: NOT SET')
print(f'API Key: {\"SET\" if api_key else \"NOT SET\"}')
"
```

### 2. Test Index Creation
```bash
python -c "
from elasticsearch_client import init_elasticsearch, create_documents_index
import os
from dotenv import load_dotenv

load_dotenv()
init_elasticsearch(
    endpoint=os.getenv('ELASTICSEARCH_ENDPOINT'),
    api_key=os.getenv('ELASTICSEARCH_API_KEY')
)
create_documents_index()
print('✅ Index created successfully')
"
```

### 3. Run Full Test Suite
```bash
python test_elasticsearch_integration.py
```

---

## 🐛 Troubleshooting

### Error: "Connection refused"

**Cause:** Incorrect endpoint URL

**Solution:**
1. Check your endpoint URL in Elastic Cloud Console
2. Ensure it starts with `https://`
3. Verify no trailing slashes

```env
# ✅ Correct
ELASTICSEARCH_ENDPOINT=https://my-project.es.us-central1.gcp.elastic-cloud.com

# ❌ Wrong
ELASTICSEARCH_ENDPOINT=https://my-project.es.us-central1.gcp.elastic-cloud.com/
```

### Error: "Authentication failed"

**Cause:** Invalid or expired API key

**Solution:**
1. Go to Elastic Cloud Console
2. Navigate to your project → "Management" → "API Keys"
3. Create a new API key
4. Update `.env` file

### Error: "Index creation failed"

**Cause:** Insufficient permissions

**Solution:**
1. Ensure API key has "manage" permissions
2. Create a new API key with full permissions
3. Update `.env` file

---

## 📊 Serverless vs Hosted Comparison

| Feature | Serverless | Hosted Cloud |
|---------|-----------|--------------|
| Setup Time | 2 minutes | 5 minutes |
| Configuration | Endpoint + API Key | Cloud ID + API Key |
| Scaling | Automatic | Manual/Auto |
| Cost | Pay-per-use | Fixed monthly |
| Management | Zero | Minimal |
| Best For | Hackathons, demos | Production apps |

---

## 💰 Pricing

### Free Tier
- ✅ 14-day trial
- ✅ No credit card required
- ✅ Full features
- ✅ Perfect for hackathons

### After Trial
- Pay only for what you use
- Typically $0.10-0.50 per hour
- Auto-scales down when idle
- More cost-effective for variable workloads

---

## 🎯 Hackathon Tips

### 1. Create Project Early
Set up your Elasticsearch Serverless project before the hackathon starts to avoid setup time.

### 2. Save Credentials Securely
Store your endpoint and API key in a password manager. You'll need them multiple times.

### 3. Test Before Demo
Run the full test suite before your presentation to ensure everything works.

### 4. Monitor Usage
Check the Elastic Cloud Console to see your usage and ensure you're within limits.

### 5. Have Backup
Take screenshots of working system in case of connectivity issues during demo.

---

## 📚 Additional Resources

### Elastic Cloud Console
- [Console](https://cloud.elastic.co)
- [Documentation](https://www.elastic.co/guide/en/cloud/current/ec-getting-started.html)
- [Serverless Docs](https://www.elastic.co/guide/en/serverless/current/index.html)

### API Documentation
- [Python Client](https://elasticsearch-py.readthedocs.io/)
- [REST API](https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html)

---

## ✅ Setup Checklist

- [ ] Created Elasticsearch Serverless project
- [ ] Saved endpoint URL
- [ ] Saved API key
- [ ] Added to `.env` file
- [ ] Installed dependencies
- [ ] Tested connection
- [ ] Ran test suite (7/7 pass)
- [ ] Started server successfully
- [ ] Uploaded test file
- [ ] Search works

---

## 🎉 You're Ready!

Your Elasticsearch Serverless deployment is configured and ready for your hackathon!

**Next steps:**
1. Upload a test document
2. Try searching
3. Practice your demo
4. Win the hackathon! 🚀

---

**Pro tip:** Serverless deployments are perfect for hackathons because they auto-scale and you don't need to worry about infrastructure management!
