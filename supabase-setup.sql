-- ============================================
-- QR Doc Share - Supabase Setup Script
-- Run this in your new Supabase project's SQL Editor
-- ============================================

-- 1. Create the documents metadata table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id TEXT UNIQUE NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_name TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  access_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. Create indexes
CREATE INDEX idx_documents_expires_at ON documents(expires_at);
CREATE INDEX idx_documents_user_id ON documents(user_id);

-- 3. Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Users can insert their own documents
CREATE POLICY "Users can insert own documents" ON documents
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can view their own documents
CREATE POLICY "Users can view own documents" ON documents
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents" ON documents
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Anyone can view document info (for download page)
CREATE POLICY "Public can view document info" ON documents
FOR SELECT TO anon
USING (true);

-- 5. Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage policies
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Anyone can read files" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'documents');

CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'documents');

-- 7. Cleanup function for expired documents
CREATE OR REPLACE FUNCTION cleanup_expired_documents()
RETURNS INTEGER AS $$
DECLARE
  expired_doc RECORD;
  deleted_count INTEGER := 0;
BEGIN
  FOR expired_doc IN
    SELECT file_name, document_id FROM documents
    WHERE expires_at < NOW()
  LOOP
    DELETE FROM storage.objects
    WHERE bucket_id = 'documents' AND name = expired_doc.file_name;

    DELETE FROM documents WHERE document_id = expired_doc.document_id;

    deleted_count := deleted_count + 1;
  END LOOP;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Enable pg_cron (if available on your plan)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('cleanup-expired-docs', '0 2 * * *', 'SELECT cleanup_expired_documents();');
