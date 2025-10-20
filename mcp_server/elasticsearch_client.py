"""
Elasticsearch client for vector embeddings and semantic search
Replaces Supabase pgvector for RAG functionality
"""

import os
import logging
from typing import List, Dict, Any, Optional
from elasticsearch import Elasticsearch

logger = logging.getLogger(__name__)

# Global Elasticsearch client
es_client: Optional[Elasticsearch] = None

# Index configuration
DOCUMENTS_INDEX = "documents"
EMBEDDING_DIM = 384  # Sentence Transformers all-MiniLM-L6-v2


def init_elasticsearch(cloud_id: str = None, api_key: str = None, hosts: List[str] = None, endpoint: str = None) -> Elasticsearch:
    """
    Initialize Elasticsearch client
    
    Args:
        cloud_id: Elastic Cloud ID (for hosted cloud deployment)
        api_key: API key for authentication
        hosts: List of host URLs (for self-hosted)
        endpoint: Elasticsearch endpoint URL (for serverless deployment)
        
    Returns:
        Elasticsearch client instance
    """
    global es_client
    
    try:
        if endpoint and api_key:
            # Serverless deployment with endpoint URL
            logger.info(f"Connecting to Elasticsearch Serverless at {endpoint}...")
            es_client = Elasticsearch(
                hosts=[endpoint],
                api_key=api_key,
                verify_certs=True
            )
        elif cloud_id and api_key:
            # Hosted Cloud connection
            logger.info("Connecting to Elasticsearch Cloud...")
            es_client = Elasticsearch(
                cloud_id=cloud_id,
                api_key=api_key
            )
        elif hosts:
            # Self-hosted connection
            logger.info(f"Connecting to Elasticsearch at {hosts}...")
            es_client = Elasticsearch(hosts=hosts)
        else:
            raise ValueError("Either endpoint+api_key, cloud_id+api_key, or hosts must be provided")
        
        # Test connection
        if es_client.ping():
            logger.info("✅ Elasticsearch connected successfully")
            # Create index if it doesn't exist
            create_documents_index()
        else:
            raise ConnectionError("Failed to ping Elasticsearch")
        
        return es_client
        
    except Exception as e:
        logger.error(f"Failed to initialize Elasticsearch: {e}")
        es_client = None
        raise


def get_elasticsearch_client() -> Elasticsearch:
    """Get the global Elasticsearch client"""
    if es_client is None:
        raise RuntimeError("Elasticsearch client not initialized. Call init_elasticsearch() first.")
    return es_client


def create_documents_index():
    """
    Create the documents index with proper mappings for vector search
    Compatible with both serverless and hosted deployments
    """
    try:
        es = get_elasticsearch_client()
        
        # Check if index already exists
        if es.indices.exists(index=DOCUMENTS_INDEX):
            logger.info(f"Index '{DOCUMENTS_INDEX}' already exists")
            return
        
        # Create index with mappings (no settings for serverless compatibility)
        index_config = {
            "mappings": {
                "properties": {
                    "content": {
                        "type": "text",
                        "analyzer": "english"
                    },
                    "embedding": {
                        "type": "dense_vector",
                        "dims": EMBEDDING_DIM,
                        "index": True,
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
        
        # Try to create with settings first (for hosted deployments)
        try:
            index_config["settings"] = {
                "number_of_shards": 1,
                "number_of_replicas": 1
            }
            es.indices.create(index=DOCUMENTS_INDEX, body=index_config)
            logger.info(f"✅ Created index '{DOCUMENTS_INDEX}' with vector search support (hosted)")
        except Exception as settings_error:
            # If settings fail (serverless), try without settings
            if "serverless" in str(settings_error).lower() or "illegal_argument" in str(settings_error).lower():
                logger.info("Detected serverless deployment, creating index without shard/replica settings...")
                index_config.pop("settings", None)
                es.indices.create(index=DOCUMENTS_INDEX, body=index_config)
                logger.info(f"✅ Created index '{DOCUMENTS_INDEX}' with vector search support (serverless)")
            else:
                raise settings_error
        
    except Exception as e:
        logger.error(f"Error creating documents index: {e}")
        raise


def index_document_chunk(
    chunk_id: str,
    file_id: str,
    user_id: str,
    content: str,
    embedding: List[float],
    chunk_index: int,
    page_number: Optional[int] = None,
    filename: Optional[str] = None
) -> Dict[str, Any]:
    """
    Index a document chunk with its embedding in Elasticsearch
    
    Args:
        chunk_id: Unique chunk identifier
        file_id: File identifier
        user_id: User identifier
        content: Text content of the chunk
        embedding: Vector embedding (384 dimensions)
        chunk_index: Index of the chunk in the document
        page_number: Page number (optional)
        filename: Original filename (optional)
        
    Returns:
        Elasticsearch response
    """
    try:
        from datetime import datetime
        es = get_elasticsearch_client()
        
        document = {
            "chunk_id": chunk_id,
            "file_id": file_id,
            "user_id": user_id,
            "content": content,
            "embedding": embedding,
            "chunk_index": chunk_index,
            "page_number": page_number,
            "filename": filename,
            "created_at": datetime.utcnow().isoformat() + "Z"  # ISO 8601 format
        }
        
        response = es.index(
            index=DOCUMENTS_INDEX,
            id=chunk_id,
            document=document
        )
        
        logger.info(f"Indexed chunk {chunk_id} for file {file_id}")
        return response
        
    except Exception as e:
        logger.error(f"Error indexing document chunk: {e}")
        raise


def search_similar_chunks(
    query_embedding: List[float],
    user_id: str,
    k: int = 5,
    num_candidates: int = 50,
    use_hybrid: bool = True,
    query_text: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Search for similar document chunks using vector similarity
    
    Args:
        query_embedding: Query vector embedding
        user_id: User identifier to filter results
        k: Number of results to return
        num_candidates: Number of candidates to consider
        use_hybrid: Whether to use hybrid search (vector + keyword)
        query_text: Query text for keyword search (required if use_hybrid=True)
        
    Returns:
        List of matching chunks with scores
    """
    try:
        es = get_elasticsearch_client()
        
        if use_hybrid and query_text:
            # Hybrid search: vector + keyword
            search_query = {
                "bool": {
                    "must": [
                        {"term": {"user_id": user_id}}
                    ],
                    "should": [
                        {
                            "match": {
                                "content": {
                                    "query": query_text,
                                    "boost": 0.3  # Lower weight for keyword match
                                }
                            }
                        }
                    ]
                }
            }
            
            response = es.search(
                index=DOCUMENTS_INDEX,
                query=search_query,
                knn={
                    "field": "embedding",
                    "query_vector": query_embedding,
                    "k": k,
                    "num_candidates": num_candidates,
                    "boost": 0.7  # Higher weight for vector similarity
                },
                size=k,
                _source=["content", "file_id", "chunk_id", "page_number", "filename", "chunk_index"]
            )
        else:
            # Pure vector search
            response = es.search(
                index=DOCUMENTS_INDEX,
                query={"term": {"user_id": user_id}},
                knn={
                    "field": "embedding",
                    "query_vector": query_embedding,
                    "k": k,
                    "num_candidates": num_candidates
                },
                size=k,
                _source=["content", "file_id", "chunk_id", "page_number", "filename", "chunk_index"]
            )
        
        # Format results
        results = []
        for hit in response["hits"]["hits"]:
            result = {
                "id": hit["_source"]["chunk_id"],
                "content": hit["_source"]["content"],
                "file_id": hit["_source"]["file_id"],
                "page_number": hit["_source"].get("page_number"),
                "filename": hit["_source"].get("filename"),
                "chunk_index": hit["_source"].get("chunk_index"),
                "similarity_score": hit["_score"]
            }
            results.append(result)
        
        logger.info(f"Found {len(results)} similar chunks for user {user_id}")
        return results
        
    except Exception as e:
        logger.error(f"Error searching similar chunks: {e}")
        return []


def delete_file_chunks(file_id: str) -> Dict[str, Any]:
    """
    Delete all chunks associated with a file
    
    Args:
        file_id: File identifier
        
    Returns:
        Elasticsearch response
    """
    try:
        es = get_elasticsearch_client()
        
        response = es.delete_by_query(
            index=DOCUMENTS_INDEX,
            query={"term": {"file_id": file_id}}
        )
        
        logger.info(f"Deleted {response['deleted']} chunks for file {file_id}")
        return response
        
    except Exception as e:
        logger.error(f"Error deleting file chunks: {e}")
        raise


def delete_user_chunks(user_id: str) -> Dict[str, Any]:
    """
    Delete all chunks for a user
    
    Args:
        user_id: User identifier
        
    Returns:
        Elasticsearch response
    """
    try:
        es = get_elasticsearch_client()
        
        response = es.delete_by_query(
            index=DOCUMENTS_INDEX,
            query={"term": {"user_id": user_id}}
        )
        
        logger.info(f"Deleted {response['deleted']} chunks for user {user_id}")
        return response
        
    except Exception as e:
        logger.error(f"Error deleting user chunks: {e}")
        raise


def get_index_stats() -> Dict[str, Any]:
    """
    Get statistics about the documents index
    Compatible with both serverless and hosted deployments
    
    Returns:
        Index statistics
    """
    try:
        es = get_elasticsearch_client()
        
        # Get document count (works in serverless)
        count = es.count(index=DOCUMENTS_INDEX)
        
        result = {
            "total_documents": count["count"],
            "index_name": DOCUMENTS_INDEX
        }
        
        # Try to get detailed stats (only works in hosted mode)
        try:
            stats = es.indices.stats(index=DOCUMENTS_INDEX)
            result["index_size"] = stats["indices"][DOCUMENTS_INDEX]["total"]["store"]["size_in_bytes"]
        except Exception as stats_error:
            # Serverless mode doesn't support stats API
            if "serverless" in str(stats_error).lower() or "api_not_available" in str(stats_error).lower():
                logger.info("Stats API not available in serverless mode (this is normal)")
                result["index_size"] = "N/A (serverless mode)"
            else:
                logger.warning(f"Could not get detailed stats: {stats_error}")
                result["index_size"] = 0
        
        return result
        
    except Exception as e:
        logger.error(f"Error getting index stats: {e}")
        return {
            "total_documents": 0,
            "index_size": 0,
            "index_name": DOCUMENTS_INDEX
        }


if __name__ == "__main__":
    # Test the Elasticsearch connection
    logging.basicConfig(level=logging.INFO)
    
    # Example usage
    print("Testing Elasticsearch client...")
    
    # Initialize (you'll need to set these environment variables)
    endpoint = os.getenv("ELASTICSEARCH_ENDPOINT")
    cloud_id = os.getenv("ELASTICSEARCH_CLOUD_ID")
    api_key = os.getenv("ELASTICSEARCH_API_KEY")
    hosts = os.getenv("ELASTICSEARCH_HOSTS")
    
    if endpoint and api_key:
        init_elasticsearch(endpoint=endpoint, api_key=api_key)
        print("✅ Elasticsearch initialized successfully (Serverless)")
    elif cloud_id and api_key:
        init_elasticsearch(cloud_id=cloud_id, api_key=api_key)
        print("✅ Elasticsearch initialized successfully (Cloud)")
    elif hosts:
        hosts_list = [h.strip() for h in hosts.split(',')]
        init_elasticsearch(hosts=hosts_list)
        print("✅ Elasticsearch initialized successfully (Self-hosted)")
    else:
        print("⚠️  Set ELASTICSEARCH_ENDPOINT + ELASTICSEARCH_API_KEY (serverless)")
        print("    OR ELASTICSEARCH_CLOUD_ID + ELASTICSEARCH_API_KEY (cloud)")
        print("    OR ELASTICSEARCH_HOSTS (self-hosted)")
        exit(1)
    
    # Get stats
    stats = get_index_stats()
    print(f"Index stats: {stats}")
