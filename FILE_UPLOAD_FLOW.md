# File Upload Flow - Elasticsearch Integration

Complete guide to how file uploads work with the new Elasticsearch integration.

---

## 🔄 File Upload Flow

### When You Upload a File (Admin Panel or API)

```
1. User uploads file (PDF, DOCX, etc.)
   │
   ▼
2. File sent to MCP Server (/mcp/upload-pdf endpoint)
   │
   ▼
3. File stored in Supabase Storage ✅ SAME AS BEFORE
   │
   ▼
4. Metadata saved to Supabase 'files' table ✅ SAME AS BEFORE
   │
   ▼
5. Text extracted from file ✅ SAME AS BEFORE
   │
   ▼
6. Text chunked (1000 chars, 200 overlap) ✅ SAME AS BEFORE
   │
   ▼
7. Chunks saved to Supabase 'file_chunks' table ✅ SAME AS BEFORE
   │
   ▼
8. For each chunk:
   ├─ Generate 384-dim embedding ✅ SAME AS BEFORE
   │
   ├─ Store in Elasticsearch 🆕 NEW!
   │  (instead of Supabase embeddings table)
   │
   └─ Chunk metadata remains in Supabase ✅ SAME AS BEFORE
   │
   ▼
9. File status updated to 'processed' ✅ SAME AS BEFORE
```

---

## 📊 Data Storage Comparison

### Before (Supabase Only)

| Data | Location |
|------|----------|
| File binary | Supabase Storage |
| File metadata | Supabase `files` table |
| Text chunks | Supabase `file_chunks` table |
| Vector embeddings | Supabase `embeddings` table |
| Search | Supabase pgvector RPC |

### After (Supabase + Elasticsearch)

| Data | Location |
|------|----------|
| File binary | Supabase Storage ✅ |
| File metadata | Supabase `files` table ✅ |
| Text chunks | Supabase `file_chunks` table ✅ |
| Vector embeddings | **Elasticsearch** 🆕 |
| Search | **Elasticsearch** 🆕 |

---

## 🗄️ Supabase Tables - What Changed?

### Tables Still Used (No Changes Needed)

✅ **users** - User profiles
```sql
-- No changes needed
id, firebase_uid, email, name, is_admin, created_at
```

✅ **admin_users** - Admin accounts
```sql
-- No changes needed
id, email, password_hash, name, is_active, created_at, last_login
```

✅ **files** - File metadata
```sql
-- No changes needed
id, user_id, filename, original_filename, file_type, file_size, 
file_path, content_type, upload_status, processing_error, 
created_at, updated_at
```

✅ **file_chunks** - Text chunks
```sql
-- No changes needed
id, file_id, chunk_index, content, page_number, created_at
```

✅ **messages** - Chat history
```sql
-- No changes needed
id, user_id, role, content, metadata, file_context_ids, created_at
```

✅ **file_permissions** - Admin access control
```sql
-- No changes needed
id, file_id, admin_user_id, permission_type, granted_at, granted_by
```

### Table No Longer Used for Search

⚠️ **embeddings** - Vector embeddings
```sql
-- This table is no longer used for search
-- Elasticsearch handles vectors now
-- You can keep it or drop it (won't affect functionality)
id, file_chunk_id, message_id, vector, content_type, created_at
```

**Options:**
1. **Keep it** - No harm, just unused (recommended for now)
2. **Drop it** - If you want to clean up (optional)

---

## 🔍 Search Flow Comparison

### Before (Supabase pgvector)

```
User query
   │
   ▼
Generate embedding
   │
   ▼
Call Supabase RPC: match_file_chunks()
   │
   ▼
pgvector searches embeddings table
   │
   ▼
Return results
```

### After (Elasticsearch)

```
User query
   │
   ▼
Generate embedding
   │
   ▼
Elasticsearch hybrid search:
   ├─ Vector similarity (cosine)
   └─ Keyword matching (BM25)
   │
   ▼
Optional: Cross-encoder re-ranking
   │
   ▼
Return results (faster & more relevant)
```

---

## 💾 What's Stored Where

### Supabase Storage
```
files/
└── uploads/
    └── {user_id}/
        ├── abc123.pdf
        ├── def456.docx
        └── ghi789.txt
```

### Supabase Database
```
users table:
├── user_id: uuid
├── firebase_uid: text
└── ...

files table:
├── file_id: uuid
├── user_id: uuid (FK)
├── filename: "abc123.pdf"
├── file_path: "uploads/{user_id}/abc123.pdf"
└── ...

file_chunks table:
├── chunk_id: uuid
├── file_id: uuid (FK)
├── content: "The project deadline is..."
├── chunk_index: 0
└── ...
```

### Elasticsearch
```
documents index:
├── chunk_id: "uuid-from-supabase"
├── file_id: "uuid-from-supabase"
├── user_id: "uuid-from-supabase"
├── content: "The project deadline is..."
├── embedding: [0.123, -0.456, ..., 0.789] (384 dims)
├── chunk_index: 0
├── page_number: 1
└── filename: "project_requirements.pdf"
```

---

## 🔧 Admin Panel Upload

### Your Admin Panel Upload Flow

When you upload from the admin panel:

1. **Frontend** → Sends file to backend
2. **Backend** → Forwards to MCP server
3. **MCP Server** → Processes file:
   - Stores in Supabase Storage ✅
   - Saves metadata to Supabase ✅
   - Extracts text ✅
   - Chunks text ✅
   - Generates embeddings ✅
   - **Indexes in Elasticsearch** 🆕
4. **Response** → Returns success to admin panel

**Everything works the same from the admin panel perspective!**

---

## 🧪 Testing File Upload

### Test via Admin Panel
1. Login to admin panel
2. Go to file upload section
3. Upload a test PDF
4. Check if it appears in file list
5. Try searching for content

### Test via API
```bash
# Upload file
curl -X POST "http://localhost:8000/mcp/upload-pdf" \
  -F "user_id=test_user" \
  -F "file=@test.pdf"

# Check if indexed in Elasticsearch
curl -X POST "http://localhost:8000/mcp/search-files" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "query": "test content"
  }'
```

---

## ✅ Database Migration Checklist

### If You Have Existing Data

- [ ] Your existing Supabase schema works as-is
- [ ] No schema changes needed
- [ ] Files table: ✅ Works
- [ ] File_chunks table: ✅ Works
- [ ] Messages table: ✅ Works
- [ ] Users table: ✅ Works

### If You Want to Migrate Existing Embeddings

```bash
# Optional: Migrate existing data to Elasticsearch
cd mcp_server
python migrate_to_elasticsearch.py
```

This will:
1. Read all file_chunks from Supabase
2. Generate embeddings (if not already done)
3. Index them in Elasticsearch
4. Verify migration

---

## 🎯 Key Takeaways

1. ✅ **File uploads work exactly the same** from your perspective
2. ✅ **Supabase still stores** files, metadata, and chunks
3. 🆕 **Elasticsearch now handles** vector search (faster & better)
4. ✅ **No schema changes needed** in Supabase
5. ✅ **Admin panel works** without modifications
6. ⚠️ **Embeddings table** is optional now (can keep or drop)

---

## 🚀 Ready to Test?

1. **Upload a file** via admin panel
2. **Check Supabase** - File should be in `files` table
3. **Check Elasticsearch** - Run:
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
4. **Try searching** - Should return relevant results

---

**Everything is backward compatible! Your admin panel will work without any changes! 🎉**
