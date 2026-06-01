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
  access_count INTEGER DEFAULT 0
);

-- 2. Create index for faster expiration queries
CREATE INDEX idx_documents_expires_at ON documents(expires_at);

-- 3. Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 4. Allow public read/write access
CREATE POLICY "Allow public insert" ON documents
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public select" ON documents
FOR SELECT TO anon USING (true);

CREATE POLICY "Allow public delete" ON documents
FOR DELETE TO anon USING (true);

-- 5. Create storage bucket (run separately if this fails)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage policies - allow public uploads and reads
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO anon WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT TO anon USING (bucket_id = 'documents');

CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE TO anon USING (bucket_id = 'documents');

-- 7. Function to delete expired documents
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
    -- Delete file from storage
    DELETE FROM storage.objects
    WHERE bucket_id = 'documents' AND name = expired_doc.file_name;

    -- Delete metadata from table
    DELETE FROM documents WHERE document_id = expired_doc.document_id;

    deleted_count := deleted_count + 1;
  END LOOP;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Enable pg_cron extension for scheduled cleanup
-- NOTE: pg_cron may need to be enabled in Supabase Dashboard > Database > Extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 9. Schedule daily cleanup at 2 AM UTC
SELECT cron.schedule(
  'cleanup-expired-docs',
  '0 2 * * *',
  'SELECT cleanup_expired_documents();'
);