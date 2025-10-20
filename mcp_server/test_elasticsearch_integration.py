"""
Test script for Elasticsearch integration
Verifies that the RAG functionality works with Elasticsearch
"""

import os
import sys
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from elasticsearch_client import (
    init_elasticsearch,
    create_documents_index,
    index_document_chunk,
    search_similar_chunks,
    delete_file_chunks,
    get_index_stats
)
from embeddings import generate_embedding

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_connection():
    """Test 1: Verify Elasticsearch connection"""
    logger.info("\n" + "="*60)
    logger.info("TEST 1: Elasticsearch Connection")
    logger.info("="*60)
    
    try:
        es_endpoint = os.getenv("ELASTICSEARCH_ENDPOINT")
        es_cloud_id = os.getenv("ELASTICSEARCH_CLOUD_ID")
        es_api_key = os.getenv("ELASTICSEARCH_API_KEY")
        es_hosts = os.getenv("ELASTICSEARCH_HOSTS")
        
        if es_endpoint and es_api_key:
            init_elasticsearch(endpoint=es_endpoint, api_key=es_api_key)
            logger.info("✅ Connected to Elasticsearch Serverless")
        elif es_cloud_id and es_api_key:
            init_elasticsearch(cloud_id=es_cloud_id, api_key=es_api_key)
            logger.info("✅ Connected to Elasticsearch Cloud")
        elif es_hosts:
            hosts = [h.strip() for h in es_hosts.split(',')]
            init_elasticsearch(hosts=hosts)
            logger.info(f"✅ Connected to Elasticsearch at {hosts}")
        else:
            raise Exception("No Elasticsearch configuration found")
        
        return True
    except Exception as e:
        logger.error(f"❌ Connection failed: {e}")
        return False


def test_index_creation():
    """Test 2: Verify index creation"""
    logger.info("\n" + "="*60)
    logger.info("TEST 2: Index Creation")
    logger.info("="*60)
    
    try:
        create_documents_index()
        logger.info("✅ Index created/verified successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Index creation failed: {e}")
        return False


def test_indexing():
    """Test 3: Index sample documents"""
    logger.info("\n" + "="*60)
    logger.info("TEST 3: Document Indexing")
    logger.info("="*60)
    
    try:
        # Sample documents
        test_docs = [
            {
                "chunk_id": "test_chunk_1",
                "file_id": "test_file_1",
                "user_id": "test_user",
                "content": "The project deadline is December 15, 2025. All deliverables must be submitted by this date.",
                "chunk_index": 0,
                "page_number": 1,
                "filename": "project_info.pdf"
            },
            {
                "chunk_id": "test_chunk_2",
                "file_id": "test_file_1",
                "user_id": "test_user",
                "content": "The team meeting is scheduled for every Monday at 10 AM in the conference room.",
                "chunk_index": 1,
                "page_number": 1,
                "filename": "project_info.pdf"
            },
            {
                "chunk_id": "test_chunk_3",
                "file_id": "test_file_1",
                "user_id": "test_user",
                "content": "Budget allocation for Q4 is $50,000. This includes marketing, development, and operations.",
                "chunk_index": 2,
                "page_number": 2,
                "filename": "project_info.pdf"
            }
        ]
        
        for doc in test_docs:
            # Generate embedding
            embedding = generate_embedding(doc["content"])
            
            # Index document
            index_document_chunk(
                chunk_id=doc["chunk_id"],
                file_id=doc["file_id"],
                user_id=doc["user_id"],
                content=doc["content"],
                embedding=embedding,
                chunk_index=doc["chunk_index"],
                page_number=doc["page_number"],
                filename=doc["filename"]
            )
            logger.info(f"✅ Indexed: {doc['chunk_id']}")
        
        logger.info(f"✅ Successfully indexed {len(test_docs)} test documents")
        return True
    except Exception as e:
        logger.error(f"❌ Indexing failed: {e}")
        return False


def test_vector_search():
    """Test 4: Vector similarity search"""
    logger.info("\n" + "="*60)
    logger.info("TEST 4: Vector Search")
    logger.info("="*60)
    
    try:
        # Test queries
        queries = [
            "When is the project due?",
            "What time is the team meeting?",
            "How much budget do we have?"
        ]
        
        for query in queries:
            logger.info(f"\nQuery: '{query}'")
            
            # Generate query embedding
            query_embedding = generate_embedding(query)
            
            # Search
            results = search_similar_chunks(
                query_embedding=query_embedding,
                user_id="test_user",
                k=2,
                use_hybrid=False
            )
            
            if results:
                logger.info(f"Found {len(results)} results:")
                for i, result in enumerate(results, 1):
                    logger.info(f"  {i}. Score: {result['similarity_score']:.4f}")
                    logger.info(f"     Content: {result['content'][:100]}...")
            else:
                logger.warning("No results found")
        
        logger.info("\n✅ Vector search completed successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Vector search failed: {e}")
        return False


def test_hybrid_search():
    """Test 5: Hybrid search (vector + keyword)"""
    logger.info("\n" + "="*60)
    logger.info("TEST 5: Hybrid Search")
    logger.info("="*60)
    
    try:
        query = "project deadline December"
        logger.info(f"Query: '{query}'")
        
        # Generate query embedding
        query_embedding = generate_embedding(query)
        
        # Hybrid search
        results = search_similar_chunks(
            query_embedding=query_embedding,
            user_id="test_user",
            k=3,
            use_hybrid=True,
            query_text=query
        )
        
        if results:
            logger.info(f"Found {len(results)} results:")
            for i, result in enumerate(results, 1):
                logger.info(f"  {i}. Score: {result['similarity_score']:.4f}")
                logger.info(f"     Content: {result['content'][:100]}...")
        else:
            logger.warning("No results found")
        
        logger.info("\n✅ Hybrid search completed successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Hybrid search failed: {e}")
        return False


def test_cleanup():
    """Test 6: Delete test documents"""
    logger.info("\n" + "="*60)
    logger.info("TEST 6: Cleanup")
    logger.info("="*60)
    
    try:
        # Delete test file chunks
        result = delete_file_chunks("test_file_1")
        logger.info(f"✅ Deleted {result.get('deleted', 0)} test documents")
        return True
    except Exception as e:
        logger.error(f"❌ Cleanup failed: {e}")
        return False


def test_stats():
    """Test 7: Get index statistics"""
    logger.info("\n" + "="*60)
    logger.info("TEST 7: Index Statistics")
    logger.info("="*60)
    
    try:
        stats = get_index_stats()
        logger.info(f"Total documents: {stats.get('total_documents', 0)}")
        logger.info(f"Index size: {stats.get('index_size', 0)} bytes")
        logger.info(f"Index name: {stats.get('index_name', 'N/A')}")
        logger.info("✅ Statistics retrieved successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to get statistics: {e}")
        return False


def run_all_tests():
    """Run all tests"""
    logger.info("\n" + "="*60)
    logger.info("ELASTICSEARCH INTEGRATION TEST SUITE")
    logger.info("="*60)
    
    tests = [
        ("Connection", test_connection),
        ("Index Creation", test_index_creation),
        ("Document Indexing", test_indexing),
        ("Vector Search", test_vector_search),
        ("Hybrid Search", test_hybrid_search),
        ("Cleanup", test_cleanup),
        ("Statistics", test_stats)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            logger.error(f"Test '{test_name}' crashed: {e}")
            results[test_name] = False
    
    # Summary
    logger.info("\n" + "="*60)
    logger.info("TEST SUMMARY")
    logger.info("="*60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        logger.info(f"{status} - {test_name}")
    
    logger.info("="*60)
    logger.info(f"Results: {passed}/{total} tests passed")
    logger.info("="*60)
    
    return passed == total


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
