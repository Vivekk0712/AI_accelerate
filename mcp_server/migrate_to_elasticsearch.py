"""
Migration script to move embeddings from Supabase pgvector to Elasticsearch
Run this once after setting up Elasticsearch to migrate existing data
"""

import os
import sys
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from supabase_client import init_supabase
from elasticsearch_client import init_elasticsearch, index_document_chunk, get_index_stats
from embeddings import generate_embedding

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def migrate_embeddings():
    """
    Migrate all file chunks and embeddings from Supabase to Elasticsearch
    """
    try:
        # Initialize Supabase
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        supabase = init_supabase(supabase_url, supabase_key)
        
        if not supabase:
            raise Exception("Failed to initialize Supabase")
        
        # Initialize Elasticsearch
        es_endpoint = os.getenv("ELASTICSEARCH_ENDPOINT")
        es_cloud_id = os.getenv("ELASTICSEARCH_CLOUD_ID")
        es_api_key = os.getenv("ELASTICSEARCH_API_KEY")
        es_hosts = os.getenv("ELASTICSEARCH_HOSTS")
        
        if es_endpoint and es_api_key:
            init_elasticsearch(endpoint=es_endpoint, api_key=es_api_key)
        elif es_cloud_id and es_api_key:
            init_elasticsearch(cloud_id=es_cloud_id, api_key=es_api_key)
        elif es_hosts:
            hosts = [h.strip() for h in es_hosts.split(',')]
            init_elasticsearch(hosts=hosts)
        else:
            raise Exception("Elasticsearch configuration not found in .env")
        
        logger.info("✅ Connected to Supabase and Elasticsearch")
        
        # Get all file chunks with their file and user information
        logger.info("Fetching file chunks from Supabase...")
        response = supabase.table('file_chunks').select(
            'id, file_id, chunk_index, content, page_number, files!inner(user_id, original_filename)'
        ).execute()
        
        if not response.data:
            logger.info("No file chunks found to migrate")
            return
        
        chunks = response.data
        logger.info(f"Found {len(chunks)} chunks to migrate")
        
        # Migrate each chunk
        success_count = 0
        error_count = 0
        
        for i, chunk in enumerate(chunks, 1):
            try:
                chunk_id = chunk['id']
                file_id = chunk['file_id']
                user_id = chunk['files']['user_id']
                filename = chunk['files']['original_filename']
                content = chunk['content']
                chunk_index = chunk['chunk_index']
                page_number = chunk.get('page_number')
                
                # Generate embedding for the content
                logger.info(f"[{i}/{len(chunks)}] Generating embedding for chunk {chunk_id}...")
                embedding = generate_embedding(content)
                
                # Index in Elasticsearch
                index_document_chunk(
                    chunk_id=chunk_id,
                    file_id=file_id,
                    user_id=user_id,
                    content=content,
                    embedding=embedding,
                    chunk_index=chunk_index,
                    page_number=page_number,
                    filename=filename
                )
                
                success_count += 1
                logger.info(f"✅ [{i}/{len(chunks)}] Migrated chunk {chunk_id}")
                
            except Exception as e:
                error_count += 1
                logger.error(f"❌ [{i}/{len(chunks)}] Failed to migrate chunk {chunk.get('id')}: {e}")
        
        # Show final statistics
        logger.info("\n" + "="*60)
        logger.info("MIGRATION COMPLETE")
        logger.info("="*60)
        logger.info(f"Total chunks: {len(chunks)}")
        logger.info(f"Successfully migrated: {success_count}")
        logger.info(f"Failed: {error_count}")
        
        # Show Elasticsearch index stats
        stats = get_index_stats()
        logger.info(f"\nElasticsearch Index Stats:")
        logger.info(f"  Total documents: {stats.get('total_documents', 0)}")
        logger.info(f"  Index size: {stats.get('index_size', 0)} bytes")
        logger.info("="*60)
        
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        import traceback
        logger.error(traceback.format_exc())
        sys.exit(1)


def verify_migration():
    """
    Verify that the migration was successful by comparing counts
    """
    try:
        # Initialize clients
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        supabase = init_supabase(supabase_url, supabase_key)
        
        es_endpoint = os.getenv("ELASTICSEARCH_ENDPOINT")
        es_cloud_id = os.getenv("ELASTICSEARCH_CLOUD_ID")
        es_api_key = os.getenv("ELASTICSEARCH_API_KEY")
        es_hosts = os.getenv("ELASTICSEARCH_HOSTS")
        
        if es_endpoint and es_api_key:
            init_elasticsearch(endpoint=es_endpoint, api_key=es_api_key)
        elif es_cloud_id and es_api_key:
            init_elasticsearch(cloud_id=es_cloud_id, api_key=es_api_key)
        elif es_hosts:
            hosts = [h.strip() for h in es_hosts.split(',')]
            init_elasticsearch(hosts=hosts)
        
        # Count chunks in Supabase
        supabase_count = supabase.table('file_chunks').select('id', count='exact').execute()
        supabase_total = supabase_count.count
        
        # Count documents in Elasticsearch
        stats = get_index_stats()
        es_total = stats.get('total_documents', 0)
        
        logger.info("\n" + "="*60)
        logger.info("MIGRATION VERIFICATION")
        logger.info("="*60)
        logger.info(f"Supabase file_chunks: {supabase_total}")
        logger.info(f"Elasticsearch documents: {es_total}")
        
        if supabase_total == es_total:
            logger.info("✅ Migration verified successfully!")
        else:
            logger.warning(f"⚠️  Mismatch detected: {supabase_total - es_total} chunks missing")
        
        logger.info("="*60)
        
    except Exception as e:
        logger.error(f"Verification failed: {e}")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Migrate embeddings from Supabase to Elasticsearch")
    parser.add_argument(
        '--verify',
        action='store_true',
        help='Verify migration instead of running it'
    )
    
    args = parser.parse_args()
    
    if args.verify:
        verify_migration()
    else:
        print("\n" + "="*60)
        print("ELASTICSEARCH MIGRATION TOOL")
        print("="*60)
        print("This will migrate all file chunks and embeddings from")
        print("Supabase pgvector to Elasticsearch.")
        print("\nMake sure you have:")
        print("  1. Set up Elasticsearch (Cloud or self-hosted)")
        print("  2. Added ELASTICSEARCH_* variables to .env")
        print("  3. Installed requirements: pip install -r requirements.txt")
        print("="*60)
        
        response = input("\nProceed with migration? (yes/no): ")
        
        if response.lower() in ['yes', 'y']:
            migrate_embeddings()
        else:
            print("Migration cancelled")
