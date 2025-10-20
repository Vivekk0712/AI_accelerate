-- ============================================================================
-- SUPABASE SCHEMA FOR ELASTICSEARCH INTEGRATION
-- Optimized for use with Elasticsearch vector search
-- ============================================================================
-- Run this ONCE in Supabase SQL Editor for fresh installations
-- ============================================================================

-- Note: pgvector extension is optional now (Elasticsearch handles vectors)
-- But we keep it for backward compatibility
create extension if not exists vector;

-- users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  firebase_uid text unique not null,
  email text,
  name text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- admin_users (separate table for Supabase admin authentication)
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  name text,
  is_active boolean default true,
  created_at timestamptz default now(),
  last_login timestamptz
);

-- files table for uploaded documents
create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  filename text not null,
  original_filename text not null,
  file_type text not null,
  file_size bigint not null,
  file_path text not null, -- path in Supabase Storage
  content_type text not null,
  upload_status text default 'uploaded', -- 'uploaded', 'processing', 'processed', 'failed'
  processing_error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- file_chunks for storing extracted text content
-- ✅ STILL USED: Stores chunk metadata
create table if not exists file_chunks (
  id uuid primary key default gen_random_uuid(),
  file_id uuid references files(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  page_number integer,
  created_at timestamptz default now()
);

-- messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  role text not null, -- 'user' | 'assistant' | 'system'
  content text not null,
  metadata jsonb default '{}'::jsonb,
  file_context_ids uuid[] default '{}', -- array of file_chunks IDs used for context
  created_at timestamptz default now()
);

-- embeddings table (OPTIONAL - kept for backward compatibility)
-- ⚠️ NOTE: Vector search now handled by Elasticsearch
-- This table is no longer used for search but can remain for data migration
create table if not exists embeddings (
  id uuid primary key default gen_random_uuid(),
  file_chunk_id uuid references file_chunks(id) on delete cascade,
  message_id uuid references messages(id) on delete cascade,
  vector vector(384), -- 384 dimensions for Sentence Transformers
  content_type text not null, -- 'file_chunk' or 'message'
  created_at timestamptz default now()
);

-- file_permissions for admin file access control
create table if not exists file_permissions (
  id uuid primary key default gen_random_uuid(),
  file_id uuid references files(id) on delete cascade,
  admin_user_id uuid references admin_users(id) on delete cascade,
  permission_type text not null, -- 'read', 'write', 'delete'
  granted_at timestamptz default now(),
  granted_by uuid references admin_users(id)
);

-- Create indexes for better performance
create index if not exists idx_files_user_id on files(user_id);
create index if not exists idx_files_upload_status on files(upload_status);
create index if not exists idx_file_chunks_file_id on file_chunks(file_id);
create index if not exists idx_file_chunks_content_fts on file_chunks using gin(to_tsvector('english', content));

-- Optional: Keep embeddings indexes if you want to maintain the table
create index if not exists idx_embeddings_file_chunk_id on embeddings(file_chunk_id);
create index if not exists idx_embeddings_message_id on embeddings(message_id);
create index if not exists idx_embeddings_content_type on embeddings(content_type);

-- Create updated_at trigger for files table
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_files_updated_at
  before update on files
  for each row
  execute function update_updated_at_column();

-- ============================================================================
-- OPTIONAL: Legacy functions (kept for backward compatibility)
-- These are no longer used since Elasticsearch handles vector search
-- ============================================================================

-- Semantic vector similarity search function (384 dimensions)
-- ⚠️ NOTE: This function is no longer used - Elasticsearch handles this
create or replace function public.match_file_chunks(
  query_embedding vector(384),
  match_count int,
  user_uuid uuid
)
returns table (
  id uuid,
  content text,
  page_number int,
  file_id uuid,
  similarity float
)
language sql
stable
as $$
  select fc.id,
         fc.content,
         fc.page_number,
         fc.file_id,
         1 - (e.vector <=> query_embedding) as similarity
  from public.embeddings e
  join public.file_chunks fc on fc.id = e.file_chunk_id
  join public.files f on f.id = fc.file_id
  where e.content_type = 'file_chunk'
    and f.user_id = user_uuid
  order by e.vector <=> query_embedding
  limit match_count;
$$;

-- Full-text keyword search for hybrid search
-- ✅ STILL USEFUL: Can be used as fallback if Elasticsearch is down
create or replace function public.keyword_search_chunks(
  search_query text,
  user_uuid uuid,
  match_count int
)
returns table (
  id uuid,
  content text,
  page_number int,
  file_id uuid,
  rank float
)
language sql
stable
as $$
  select fc.id,
         fc.content,
         fc.page_number,
         fc.file_id,
         ts_rank(to_tsvector('english', fc.content), 
                 plainto_tsquery('english', search_query)) as rank
  from public.file_chunks fc
  join public.files f on f.id = fc.file_id
  where f.user_id = user_uuid
    and to_tsvector('english', fc.content) @@ plainto_tsquery('english', search_query)
  order by rank desc
  limit match_count;
$$;

-- Add comments for documentation
comment on table files is 'Stores file metadata - used by both Supabase and Elasticsearch';
comment on table file_chunks is 'Stores text chunks - metadata in Supabase, vectors in Elasticsearch';
comment on table embeddings is 'Legacy table - vectors now stored in Elasticsearch';

comment on function public.match_file_chunks(vector(384), int, uuid) is 
'LEGACY: Vector search now handled by Elasticsearch. Kept for backward compatibility.';

comment on function public.keyword_search_chunks(text, uuid, int) is 
'Full-text keyword search - can be used as fallback if Elasticsearch is unavailable';

-- ============================================================================
-- SCHEMA SETUP COMPLETE
-- ============================================================================
-- 
-- What's stored where:
-- 
-- SUPABASE:
-- ✅ users, admin_users - User management
-- ✅ files - File metadata
-- ✅ file_chunks - Text chunks (content + metadata)
-- ✅ messages - Chat history
-- ✅ file_permissions - Access control
-- ✅ Storage bucket - Actual files (PDFs, DOCX, etc.)
-- 
-- ELASTICSEARCH:
-- ✅ Vector embeddings (384-dimensional)
-- ✅ Semantic search
-- ✅ Hybrid search (vector + keyword)
-- ✅ Fast retrieval
-- 
-- Next steps:
-- 1. Run: python setup_storage.py (to create storage bucket)
-- 2. Set up Elasticsearch (see ELASTICSEARCH_SETUP.md)
-- 3. Install: pip install -r requirements.txt
-- 4. Your system is ready!
-- ============================================================================

