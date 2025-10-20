"""
Quick test script for your Elasticsearch configuration
Run this to verify your endpoint and API key work correctly
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("="*60)
print("TESTING YOUR ELASTICSEARCH CONFIGURATION")
print("="*60)

# Check environment variables
endpoint = os.getenv("ELASTICSEARCH_ENDPOINT")
cloud_id = os.getenv("ELASTICSEARCH_CLOUD_ID")
api_key = os.getenv("ELASTICSEARCH_API_KEY")

print("\n1. Checking environment variables...")
print(f"   ELASTICSEARCH_ENDPOINT: {endpoint[:50] + '...' if endpoint else '❌ NOT SET'}")
print(f"   ELASTICSEARCH_CLOUD_ID: {cloud_id[:50] + '...' if cloud_id else 'Not set (OK if using endpoint)'}")
print(f"   ELASTICSEARCH_API_KEY: {'✅ SET' if api_key else '❌ NOT SET'}")

if not api_key:
    print("\n❌ ERROR: ELASTICSEARCH_API_KEY is not set!")
    print("   Please add your API key to mcp_server/.env")
    sys.exit(1)

if not endpoint and not cloud_id:
    print("\n❌ ERROR: Neither ELASTICSEARCH_ENDPOINT nor ELASTICSEARCH_CLOUD_ID is set!")
    print("   Please add one of them to mcp_server/.env")
    sys.exit(1)

# Try to connect
print("\n2. Attempting to connect to Elasticsearch...")

try:
    from elasticsearch_client import init_elasticsearch
    
    if endpoint:
        print(f"   Using endpoint: {endpoint}")
        es = init_elasticsearch(endpoint=endpoint, api_key=api_key)
    elif cloud_id:
        print(f"   Using cloud_id: {cloud_id[:50]}...")
        es = init_elasticsearch(cloud_id=cloud_id, api_key=api_key)
    
    print("   ✅ Connection successful!")
    
except Exception as e:
    print(f"   ❌ Connection failed: {e}")
    print("\n   Troubleshooting:")
    print("   1. Check your endpoint URL is correct")
    print("   2. Verify your API key is valid")
    print("   3. Ensure your Elasticsearch deployment is running")
    print("   4. Check if you need to add :443 port to the endpoint")
    sys.exit(1)

# Test index creation
print("\n3. Testing index creation...")
try:
    from elasticsearch_client import create_documents_index
    create_documents_index()
    print("   ✅ Index created/verified successfully!")
except Exception as e:
    print(f"   ❌ Index creation failed: {e}")
    sys.exit(1)

# Get index stats
print("\n4. Getting index statistics...")
try:
    from elasticsearch_client import get_index_stats
    stats = get_index_stats()
    print(f"   ✅ Index stats retrieved:")
    print(f"      - Total documents: {stats.get('total_documents', 0)}")
    print(f"      - Index size: {stats.get('index_size', 0)} bytes")
    print(f"      - Index name: {stats.get('index_name', 'N/A')}")
except Exception as e:
    print(f"   ⚠️  Could not get stats: {e}")

# Test embedding generation
print("\n5. Testing embedding generation...")
try:
    from embeddings import generate_embedding
    test_text = "This is a test"
    embedding = generate_embedding(test_text)
    print(f"   ✅ Embedding generated:")
    print(f"      - Dimension: {len(embedding)}")
    print(f"      - First 5 values: {embedding[:5]}")
except Exception as e:
    print(f"   ❌ Embedding generation failed: {e}")
    sys.exit(1)

# Summary
print("\n" + "="*60)
print("✅ ALL TESTS PASSED!")
print("="*60)
print("\nYour Elasticsearch configuration is working correctly!")
print("\nNext steps:")
print("1. Start the server: uvicorn main:app --reload")
print("2. Upload a test file")
print("3. Try searching")
print("\nYou're ready for your hackathon! 🚀")
print("="*60)
