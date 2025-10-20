# Elasticsearch Integration Guide

This guide explains how to set up and use Elasticsearch for vector embeddings in the NovaFuze-Tech project, replacing Supabase pgvector for RAG functionality.

## 🎯 What Changed?

### Before (Supabase pgvector)
```
User → Upload File → Supabase Storage
                   ↓
              Chunk Text
                   ↓
          Generate Embeddings
                   ↓
     Store in Supabase (pgvector)
                   ↓
        RAG Search via pgvector
```

### After (Elasticsearch)
```
User → Upload File → Supabase Storage (metadata only)
                   ↓
              Chunk Text
                   ↓
          Generate Embeddings
                   ↓
     Store in Elasticsearch (vectors)
                   ↓
    RAG Search via Elasticsearch
```

**Key Benefits:**
- ✅ Better vector search performance
- ✅ Hybrid search (vector + keyword)
- ✅ Scalable for large datasets
- ✅ Industry-standard search engine
- ✅ Perfect for hackathon demos

---

## 🚀 Quick Start

### Step 1: Set Up Elasticsearch

#### Option A: Elastic Cloud (Recommended for Hackathon)

1. Go to [https://cloud.elastic.co](https://cloud.elastic.co)
2. Create a free account
3. Click "Create deployment"
4. Choose a region and click "Create deployment"
5. **Save your credentials!** You'll need:
   - Cloud ID
   - API Key (or username/password)

#### Option B: Self-Hosted (Docker)

```bash
# Run Elasticsearch locally
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.12.0
```

---

### Step 2: Configure Environment Variables

Add to your `mcp_server/.env` file:

```bash
# Existing variables
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_key
JWT_SECRET_KEY=your_jwt_secret

# NEW: Elasticsearch Configuration
# Option 1: Elastic Cloud
ELASTICSEARCH_CLOUD_ID=your_cloud_id_here
ELASTICSEARCH_API_KEY=your_api_key_here

# Option 2: Self-hosted (uncomment if using Docker)
# ELASTICSEARCH_HOSTS=http://localhost:9200
```

---

### Step 3: Install Dependencies

```bash
cd mcp_server
pip install -r requirements.txt
```

This will install:
- `elasticsearch==8.12.0` - Python client for Elasticsearch
- All existing dependencies (sentence-transformers, etc.)

---

### Step 4: Migrate Existing Data (Optional)

If you have existing data in Supabase pgvector, migrate it to Elasticsearch:

```bash
cd mcp_server
python migrate_to_elasticsearch.py
```

This will:
1. Fetch all file chunks from Supabase
2. Generate embeddings (if not already generated)
3. Index them in Elasticsearch
4. Show migration statistics

To verify the migration:
```bash
python migrate_to_elasticsearch.py --verify
```

---

### Step 5: Start the Server

```bash
cd mcp_server
uvicorn main:app --reload
```

You should see:
```
✅ Supabase client initialized successfully
✅ Elasticsearch initialized (Cloud)
✅ Created index 'documents' with vector search support
```

---

## 📊 How It Works

### File Upload Flow

1. **User uploads a file** (PDF, DOCX, etc.)
2. **File stored in Supabase Storage** (unchanged)
3. **Metadata stored in Supabase** `files` table (unchanged)
4. **Text extracted and chunked** (unchanged)
5. **Chunks stored in Supabase** `file_chunks` table (unchanged)
6. **Embeddings generated** using Sentence Transformers (unchanged)
7. **🆕 Embeddings indexed in Elasticsearch** (NEW!)

### Search Flow

1. **User asks a question**
2. **Query embedding generated** using Sentence Transformers
3. **🆕 Elasticsearch performs hybrid search:**
   - Vector similarity (cosine similarity)
   - Keyword matching (BM25)
4. **Top results retrieved** and optionally re-ranked
5. **Context passed to Gemini** for response generation

---

## 🔍 Search Features

### Vector Search
```python
# Pure vector similarity search
results = search_similar_chunks(
    query="What is the project deadline?",
    user_id="user123",
    limit=5,
    use_reranking=False
)
```

### Hybrid Search (Vector + Keyword)
```python
# Combines vector similarity with keyword matching
results = search_similar_chunks(
    query="project deadline",
    user_id="user123",
    limit=5,
    use_reranking=True  # Also applies cross-encoder re-ranking
)
```

### Re-ranking
Uses a cross-encoder model to re-rank results for better relevance:
- Initial retrieval: 15 candidates (vector + keyword)
- Re-ranking: Top 5 most relevant results

---

## 🧪 Testing

### Test Elasticsearch Connection
```bash
cd mcp_server
python elasticsearch_client.py
```

### Test Search Functionality
```bash
cd mcp_server
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

### Test End-to-End
1. Start the server: `uvicorn main:app --reload`
2. Upload a file via the frontend
3. Ask questions about the file
4. Check Elasticsearch logs for search queries

---

## 📈 Monitoring

### Check Index Statistics
```python
from elasticsearch_client import get_index_stats

stats = get_index_stats()
print(f"Total documents: {stats['total_documents']}")
print(f"Index size: {stats['index_size']} bytes")
```

### View Elasticsearch Dashboard
If using Elastic Cloud:
1. Go to your deployment in [cloud.elastic.co](https://cloud.elastic.co)
2. Click "Kibana" to open the dashboard
3. Navigate to "Stack Management" → "Index Management"
4. View the `documents` index

---

## 🔧 Troubleshooting

### Connection Issues

**Error:** `Failed to initialize Elasticsearch`

**Solution:**
1. Check your `.env` file has correct credentials
2. Test connection: `curl -X GET "your_elasticsearch_url"`
3. Verify Cloud ID and API Key are correct

### Index Not Created

**Error:** `Index 'documents' does not exist`

**Solution:**
```python
from elasticsearch_client import create_documents_index
create_documents_index()
```

### Search Returns No Results

**Possible causes:**
1. No data indexed yet → Upload files first
2. Wrong user_id → Check user authentication
3. Embeddings not generated → Check logs for errors

**Debug:**
```python
from elasticsearch_client import get_index_stats
stats = get_index_stats()
print(f"Documents in index: {stats['total_documents']}")
```

### Migration Fails

**Error:** `Failed to migrate chunk`

**Solution:**
1. Check Supabase connection
2. Verify Elasticsearch is running
3. Run with `--verify` flag to see what's missing
4. Re-run migration (it's idempotent)

---

## 🎓 Architecture Details

### Elasticsearch Index Schema

```json
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "english"
      },
      "embedding": {
        "type": "dense_vector",
        "dims": 384,
        "index": true,
        "similarity": "cosine"
      },
      "file_id": {"type": "keyword"},
      "chunk_id": {"type": "keyword"},
      "chunk_index": {"type": "integer"},
      "page_number": {"type": "integer"},
      "user_id": {"type": "keyword"},
      "filename": {"type": "keyword"},
      "created_at": {"type": "date"}
    }
  }
}
```

### Embedding Model
- **Model:** `all-MiniLM-L6-v2` (Sentence Transformers)
- **Dimensions:** 384
- **Similarity:** Cosine similarity
- **Speed:** ~1000 sentences/second on CPU

### Data Flow
```
Supabase (PostgreSQL)          Elasticsearch
├── users                      └── documents index
├── files                          ├── Vector embeddings (384-dim)
├── file_chunks                    ├── Text content
├── messages                       ├── Metadata (file_id, user_id)
└── admin_users                    └── Timestamps
```

---

## 🚀 Performance Tips

1. **Batch Indexing:** Index multiple chunks at once for faster uploads
2. **Adjust `num_candidates`:** Higher = better recall, slower search
3. **Use Hybrid Search:** Combines best of vector + keyword matching
4. **Enable Re-ranking:** Improves relevance at slight performance cost
5. **Monitor Index Size:** Keep an eye on storage usage

---

## 📚 Additional Resources

- [Elasticsearch Python Client Docs](https://elasticsearch-py.readthedocs.io/)
- [Elastic Cloud Documentation](https://www.elastic.co/guide/en/cloud/current/index.html)
- [Vector Search Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html)
- [Sentence Transformers](https://www.sbert.net/)

---

## 🎉 Success Checklist

- [ ] Elasticsearch deployed (Cloud or Docker)
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Server starts without errors
- [ ] Index created successfully
- [ ] File upload works
- [ ] Search returns relevant results
- [ ] Migration completed (if applicable)

---

## 💡 Hackathon Tips

1. **Demo the hybrid search:** Show how it combines vector + keyword
2. **Highlight scalability:** Elasticsearch handles millions of documents
3. **Show real-time indexing:** Upload → Search immediately
4. **Compare with pgvector:** Faster, more features
5. **Mention production-ready:** Used by major companies

Good luck with your hackathon! 🚀
