"""
Check if you have existing files in Supabase that need to be migrated to Elasticsearch
"""

import os
import sys
from dotenv import load_dotenv

load_dotenv()

print("="*60)
print("CHECKING EXISTING DATA")
print("="*60)

# Initialize Supabase
from supabase_client import init_supabase

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = init_supabase(supabase_url, supabase_key)

if not supabase:
    print("❌ Failed to connect to Supabase")
    sys.exit(1)

print("✅ Connected to Supabase\n")

# Check users
print("1. Checking users...")
users_response = supabase.table('users').select('*').execute()
print(f"   Total users: {len(users_response.data)}")
if users_response.data:
    for user in users_response.data[:3]:  # Show first 3
        print(f"   - {user.get('name', 'No name')} ({user.get('email', 'No email')})")
print()

# Check files
print("2. Checking files...")
files_response = supabase.table('files').select('*').execute()
print(f"   Total files: {len(files_response.data)}")
if files_response.data:
    for file in files_response.data[:5]:  # Show first 5
        print(f"   - {file.get('original_filename')} (Status: {file.get('upload_status')})")
print()

# Check file_chunks
print("3. Checking file_chunks...")
chunks_response = supabase.table('file_chunks').select('id, file_id, chunk_index, content').execute()
print(f"   Total chunks: {len(chunks_response.data)}")
if chunks_response.data:
    print(f"   First chunk preview: {chunks_response.data[0].get('content', '')[:100]}...")
print()

# Check Elasticsearch
print("4. Checking Elasticsearch...")
try:
    from elasticsearch_client import init_elasticsearch, get_index_stats
    
    endpoint = os.getenv("ELASTICSEARCH_ENDPOINT")
    api_key = os.getenv("ELASTICSEARCH_API_KEY")
    
    if endpoint and api_key:
        init_elasticsearch(endpoint=endpoint, api_key=api_key)
        stats = get_index_stats()
        print(f"   Elasticsearch documents: {stats.get('total_documents', 0)}")
    else:
        print("   ⚠️  Elasticsearch not configured")
except Exception as e:
    print(f"   ❌ Elasticsearch error: {e}")

print()
print("="*60)
print("SUMMARY")
print("="*60)

if len(files_response.data) > 0 and len(chunks_response.data) > 0:
    print("✅ You have existing files in Supabase!")
    print(f"   - {len(files_response.data)} files")
    print(f"   - {len(chunks_response.data)} chunks")
    print()
    
    try:
        stats = get_index_stats()
        es_docs = stats.get('total_documents', 0)
        
        if es_docs == 0:
            print("⚠️  BUT: Elasticsearch has 0 documents!")
            print()
            print("ACTION NEEDED:")
            print("Run migration to index existing data in Elasticsearch:")
            print("   python migrate_to_elasticsearch.py")
        elif es_docs < len(chunks_response.data):
            print(f"⚠️  WARNING: Elasticsearch has {es_docs} docs but Supabase has {len(chunks_response.data)} chunks")
            print()
            print("ACTION NEEDED:")
            print("Run migration to sync data:")
            print("   python migrate_to_elasticsearch.py")
        else:
            print("✅ Elasticsearch is in sync!")
            print(f"   - {es_docs} documents indexed")
    except:
        print("⚠️  Could not check Elasticsearch status")
        print()
        print("ACTION NEEDED:")
        print("Run migration to index data in Elasticsearch:")
        print("   python migrate_to_elasticsearch.py")
else:
    print("ℹ️  No files found in Supabase")
    print()
    print("ACTION NEEDED:")
    print("Upload a file to test the system:")
    print("   1. Use the admin panel to upload a file")
    print("   2. Or use the API: curl -X POST http://localhost:8000/mcp/upload-pdf ...")

print("="*60)
