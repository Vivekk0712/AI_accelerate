# Your Elasticsearch Configuration

Quick reference for your specific Elasticsearch setup.

---

## 🔧 Your Configuration

**Endpoint URL:**
```
https://my-elasticsearch-project-f63dee.es.asia-south1.gcp.elastic.cloud:443
```

**Region:** Asia South 1 (Mumbai)  
**Provider:** Google Cloud Platform (GCP)  
**Port:** 443 (HTTPS)

---

## ✅ Current Setup

Your `mcp_server/.env` file is configured with:

```env
ELASTICSEARCH_ENDPOINT=https://my-elasticsearch-project-f63dee.es.asia-south1.gcp.elastic.cloud:443
ELASTICSEARCH_API_KEY=your_api_key_here
```

**⚠️ Important:** Replace `your_api_key_here` with your actual API key!

---

## 🔑 How to Get Your API Key

### Option 1: From Elastic Cloud Console

1. Go to [https://cloud.elastic.co](https://cloud.elastic.co)
2. Click on your deployment: **my-elasticsearch-project-f63dee**
3. Navigate to **Management** → **Stack Management**
4. Click **API Keys** (under Security)
5. Click **Create API key**
6. Give it a name (e.g., "NovaFuze-Hackathon")
7. Copy the API key (it's only shown once!)
8. Paste it in your `.env` file

### Option 2: From Deployment Page

1. Go to [https://cloud.elastic.co](https://cloud.elastic.co)
2. Click on your deployment
3. Look for **API key** or **Credentials** section
4. Copy the API key
5. Paste it in your `.env` file

---

## 🧪 Test Your Configuration

### Quick Test
```bash
cd mcp_server
python test_my_elasticsearch.py
```

**Expected output:**
```
============================================================
TESTING YOUR ELASTICSEARCH CONFIGURATION
============================================================

1. Checking environment variables...
   ELASTICSEARCH_ENDPOINT: https://my-elasticsearch-project-f63dee.es.asia-s...
   ELASTICSEARCH_CLOUD_ID: Not set (OK if using endpoint)
   ELASTICSEARCH_API_KEY: ✅ SET

2. Attempting to connect to Elasticsearch...
   Using endpoint: https://my-elasticsearch-project-f63dee.es.asia-south1.gcp.elastic.cloud:443
   ✅ Connection successful!

3. Testing index creation...
   ✅ Index created/verified successfully!

4. Getting index statistics...
   ✅ Index stats retrieved:
      - Total documents: 0
      - Index size: 0 bytes
      - Index name: documents

5. Testing embedding generation...
   ✅ Embedding generated:
      - Dimension: 384
      - First 5 values: [0.123, -0.456, 0.789, ...]

============================================================
✅ ALL TESTS PASSED!
============================================================
```

### Full Test Suite
```bash
python test_elasticsearch_integration.py
```

Should show: **7/7 tests passed ✅**

---

## 🚀 Start the Server

```bash
cd mcp_server
uvicorn main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
DEBUG: Supabase client initialized successfully
✅ Elasticsearch initialized (Serverless)
✅ Created index 'documents' with vector search support
```

---

## 🔍 Verify Connection

### Check if Elasticsearch is reachable
```bash
curl https://my-elasticsearch-project-f63dee.es.asia-south1.gcp.elastic.cloud:443
```

**Expected:** Some response (even if it's an error about authentication)

### Check with API key
```bash
curl -H "Authorization: ApiKey YOUR_API_KEY" \
  https://my-elasticsearch-project-f63dee.es.asia-south1.gcp.elastic.cloud:443
```

**Expected:** JSON response with cluster info

---

## 🐛 Troubleshooting

### Error: "Connection refused"

**Possible causes:**
1. Endpoint URL is incorrect
2. Port is wrong
3. Elasticsearch deployment is not running

**Solutions:**
1. Verify endpoint in Elastic Cloud Console
2. Ensure `:443` is included
3. Check deployment status

### Error: "Authentication failed"

**Possible causes:**
1. API key is incorrect
2. API key has expired
3. API key doesn't have permissions

**Solutions:**
1. Generate a new API key
2. Ensure API key has "manage" permissions
3. Copy the entire key (no spaces)

### Error: "SSL certificate verification failed"

**Solution:**
The code already handles this with `verify_certs=True`. If you still get this error:

```python
# In elasticsearch_client.py, change:
es_client = Elasticsearch(
    hosts=[endpoint],
    api_key=api_key,
    verify_certs=False  # Only for testing!
)
```

---

## 📊 Your Deployment Info

**Project:** my-elasticsearch-project-f63dee  
**Region:** asia-south1 (Mumbai, India)  
**Provider:** Google Cloud Platform  
**Type:** Elastic Cloud (Serverless or Hosted)  
**Endpoint:** https://my-elasticsearch-project-f63dee.es.asia-south1.gcp.elastic.cloud:443

---

## 🎯 Quick Commands

### Test connection
```bash
python test_my_elasticsearch.py
```

### Run full tests
```bash
python test_elasticsearch_integration.py
```

### Start server
```bash
uvicorn main:app --reload
```

### Check index stats
```bash
python -c "
from elasticsearch_client import init_elasticsearch, get_index_stats
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

## ✅ Configuration Checklist

- [ ] Endpoint URL added to `.env`
- [ ] API key added to `.env` (replace `your_api_key_here`)
- [ ] No extra spaces in `.env` file
- [ ] Port `:443` included in endpoint
- [ ] `test_my_elasticsearch.py` passes
- [ ] Server starts without errors
- [ ] Can upload files
- [ ] Search works

---

## 🎉 You're Ready!

Once all tests pass, you're ready to:
1. Upload documents
2. Ask questions
3. Demo your project
4. Win the hackathon! 🚀

---

## 📞 Need Help?

### Quick Checks
1. Run `python test_my_elasticsearch.py`
2. Check server logs: `uvicorn main:app --reload --log-level debug`
3. Verify API key in Elastic Cloud Console

### Documentation
- **Setup Guide:** `mcp_server/ELASTICSEARCH_SETUP.md`
- **Commands:** `mcp_server/ELASTICSEARCH_COMMANDS.md`
- **Troubleshooting:** `mcp_server/ELASTICSEARCH_SETUP.md` (section 8)

---

**Your configuration is ready! Just add your API key and you're good to go! 🚀**
