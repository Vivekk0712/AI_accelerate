# Elasticsearch Quick Command Reference

Quick reference for common Elasticsearch operations in the NovaFuze-Tech project.

---

## 🚀 Setup Commands

### Install Dependencies
```bash
cd mcp_server
pip install elasticsearch==8.12.0
# Or install all
pip install -r requirements.txt
```

### Configure Environment
```bash
# Edit .env file
nano .env

# Add these lines:
ELASTICSEARCH_CLOUD_ID=your_cloud_id
ELASTICSEARCH_API_KEY=your_api_key
```

### Test Connection
```bash
python -c "
from elasticsearch_client import init_elasticsearch
import os
from dotenv import load_dotenv
load_dotenv()
init_elasticsearch(
    cloud_id=os.getenv('ELASTICSEARCH_CLOUD_ID'),
    api_key=os.getenv('ELASTICSEARCH_API_KEY')
)
print('✅ Connected!')
"
```

---

## 🧪 Testing Commands

### Run Full Test Suite
```bash
python test_elasticsearch_integration.py
```

### Run Specific Test
```bash
# Test connection only
python -c "from test_elasticsearch_integration import test_connection; test_connection()"

# Test search only
python -c "from test_elasticsearch_integration import test_vector_search; test_vector_search()"
```

### Check Index Stats
```bash
python -c "
from elasticsearch_client import init_elasticsearch, get_index_stats
import os
from dotenv import load_dotenv
load_dotenv()
init_elasticsearch(
    cloud_id=os.getenv('ELASTICSEARCH_CLOUD_ID'),
    api_key=os.getenv('ELASTICSEARCH_API_KEY')
)
print(get_index_stats())
"
```

---

## 🔄 Migration Commands

### Migrate All Data
```bash
python migrate_to_elasticsearch.py
```

### Verify Migration
```bash
python migrate_to_elasticsearch.py --verify
```

### Check Migration Progress
```bash
# In another terminal while migration runs
watch -n 5 'python -c "from elasticsearch_client import get_index_stats, init_elasticsearch; import os; from dotenv import load_dotenv; load_dotenv(); init_elasticsearch(cloud_id=os.getenv(\"ELASTICSEARCH_CLOUD_ID\"), api_key=os.getenv(\"ELASTICSEARCH_API_KEY\")); print(get_index_stats())"'
```

---

## 🏃 Running the Server

### Development Mode
```bash
cd mcp_server
uvicorn main:app --reload
```

### With Debug Logging
```bash
uvicorn main:app --reload --log-level debug
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 🔍 Search Testing

### Test Vector Search
```bash
curl -X POST "http://localhost:8000/mcp/search-files" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "query": "project deadline"
  }'
```

### Test File Upload
```bash
curl -X POST "http://localhost:8000/mcp/upload-pdf" \
  -F "user_id=test_user" \
  -F "file=@sample.pdf"
```

### Test Chat Query
```bash
curl -X POST "http://localhost:8000/mcp/query" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "message": "What is the project deadline?",
    "user_name": "Test User",
    "user_email": "test@example.com"
  }'
```

---

## 🗑️ Cleanup Commands

### Delete Test Data
```bash
python -c "
from elasticsearch_client import init_elasticsearch, delete_file_chunks
import os
from dotenv import load_dotenv
load_dotenv()
init_elasticsearch(
    cloud_id=os.getenv('ELASTICSEARCH_CLOUD_ID'),
    api_key=os.getenv('ELASTICSEARCH_API_KEY')
)
delete_file_chunks('test_file_1')
print('✅ Test data deleted')
"
```

### Delete All User Data
```bash
python -c "
from elasticsearch_client import init_elasticsearch, delete_user_chunks
import os
from dotenv import load_dotenv
load_dotenv()
init_elasticsearch(
    cloud_id=os.getenv('ELASTICSEARCH_CLOUD_ID'),
    api_key=os.getenv('ELASTICSEARCH_API_KEY')
)
delete_user_chunks('test_user')
print('✅ User data deleted')
"
```

### Recreate Index (DANGER: Deletes all data)
```bash
python -c "
from elasticsearch_client import init_elasticsearch, get_elasticsearch_client
import os
from dotenv import load_dotenv
load_dotenv()
init_elasticsearch(
    cloud_id=os.getenv('ELASTICSEARCH_CLOUD_ID'),
    api_key=os.getenv('ELASTICSEARCH_API_KEY')
)
es = get_elasticsearch_client()
es.indices.delete(index='documents', ignore=[404])
print('✅ Index deleted')
"

# Then restart server to recreate
uvicorn main:app --reload
```

---

## 📊 Monitoring Commands

### Watch Index Size
```bash
watch -n 5 'python -c "from elasticsearch_client import get_index_stats, init_elasticsearch; import os; from dotenv import load_dotenv; load_dotenv(); init_elasticsearch(cloud_id=os.getenv(\"ELASTICSEARCH_CLOUD_ID\"), api_key=os.getenv(\"ELASTICSEARCH_API_KEY\")); stats = get_index_stats(); print(f\"Documents: {stats.get(\"total_documents\", 0)}, Size: {stats.get(\"index_size\", 0)} bytes\")"'
```

### Check Server Health
```bash
curl http://localhost:8000/health
```

### View Server Logs
```bash
# If running with systemd
journalctl -u mcp-server -f

# If running in terminal
# Just check the terminal output
```

---

## 🐳 Docker Commands (Self-Hosted)

### Start Elasticsearch
```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.12.0
```

### Check Elasticsearch Status
```bash
curl http://localhost:9200
```

### View Elasticsearch Logs
```bash
docker logs -f elasticsearch
```

### Stop Elasticsearch
```bash
docker stop elasticsearch
```

### Remove Elasticsearch
```bash
docker rm -f elasticsearch
```

---

## 🔧 Troubleshooting Commands

### Check Python Dependencies
```bash
pip list | grep elasticsearch
pip list | grep sentence-transformers
```

### Verify Environment Variables
```bash
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('ELASTICSEARCH_CLOUD_ID:', os.getenv('ELASTICSEARCH_CLOUD_ID')[:20] + '...' if os.getenv('ELASTICSEARCH_CLOUD_ID') else 'NOT SET')
print('ELASTICSEARCH_API_KEY:', 'SET' if os.getenv('ELASTICSEARCH_API_KEY') else 'NOT SET')
print('SUPABASE_URL:', os.getenv('SUPABASE_URL')[:30] + '...' if os.getenv('SUPABASE_URL') else 'NOT SET')
"
```

### Test Embedding Generation
```bash
python -c "
from embeddings import generate_embedding
text = 'This is a test'
emb = generate_embedding(text)
print(f'Embedding dimension: {len(emb)}')
print(f'First 5 values: {emb[:5]}')
"
```

### Check Supabase Connection
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
print('✅ Supabase connected' if supabase else '❌ Supabase failed')
"
```

---

## 📦 Backup & Restore

### Export Index Data (Elasticsearch Cloud)
```bash
# Use Kibana UI:
# Management → Stack Management → Snapshot and Restore
```

### Backup Supabase Data
```bash
# Supabase automatically backs up
# Or export via SQL:
# Go to Supabase → SQL Editor → Export
```

---

## 🎯 Hackathon Demo Commands

### Quick Setup
```bash
# 1. Install
pip install elasticsearch==8.12.0

# 2. Configure
echo "ELASTICSEARCH_CLOUD_ID=your_id" >> .env
echo "ELASTICSEARCH_API_KEY=your_key" >> .env

# 3. Test
python test_elasticsearch_integration.py

# 4. Run
uvicorn main:app --reload
```

### Demo Data Setup
```bash
# Upload sample file
curl -X POST "http://localhost:8000/mcp/upload-pdf" \
  -F "user_id=demo_user" \
  -F "file=@demo_document.pdf"

# Wait for processing (check logs)

# Test search
curl -X POST "http://localhost:8000/mcp/search-files" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "demo_user", "query": "key information"}'
```

---

## 💡 Useful One-Liners

### Count Documents
```bash
python -c "from elasticsearch_client import *; import os; from dotenv import load_dotenv; load_dotenv(); init_elasticsearch(cloud_id=os.getenv('ELASTICSEARCH_CLOUD_ID'), api_key=os.getenv('ELASTICSEARCH_API_KEY')); print(get_index_stats()['total_documents'])"
```

### Test Search Speed
```bash
time python -c "from elasticsearch_client import *; from embeddings import generate_embedding; import os; from dotenv import load_dotenv; load_dotenv(); init_elasticsearch(cloud_id=os.getenv('ELASTICSEARCH_CLOUD_ID'), api_key=os.getenv('ELASTICSEARCH_API_KEY')); emb = generate_embedding('test query'); results = search_similar_chunks(emb, 'test_user', k=5); print(f'Found {len(results)} results')"
```

### Check All Services
```bash
echo "Checking services..."
curl -s http://localhost:8000/health && echo "✅ MCP Server" || echo "❌ MCP Server"
curl -s http://localhost:4000/api/health && echo "✅ Backend" || echo "❌ Backend"
curl -s http://localhost:5173 && echo "✅ Frontend" || echo "❌ Frontend"
```

---

## 📚 Additional Resources

- **Elasticsearch Docs:** https://www.elastic.co/guide/
- **Python Client:** https://elasticsearch-py.readthedocs.io/
- **Sentence Transformers:** https://www.sbert.net/
- **Project Docs:** See `ELASTICSEARCH_SETUP.md`

---

**Quick tip:** Bookmark this file for easy reference during development and demos! 🚀
