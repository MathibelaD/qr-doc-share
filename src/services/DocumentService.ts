// src/services/DocumentService.ts
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface UploadResponse {
  documentId: string;
  downloadUrl: string;
  qrCodeUrl: string;
}

export interface DocumentInfo {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  fileName: string;
  uploadDate: string;
  accessCount: number;
}

export const DocumentService = {
  /**
   * Upload a document to Supabase Storage
   */
  async uploadDocument(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    const documentId = uuidv4();
    const fileName = `${Date.now()}_${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    const downloadUrl = publicUrl;
    const qrCodeUrl = `${window.location.origin}/download/${documentId}`;

    // Store document metadata (you could use Supabase database for this)
    const docInfo = {
      id: documentId,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      fileName: fileName,
      uploadDate: new Date().toISOString(),
      accessCount: 0
    };

    // Store in localStorage for now (in production, use Supabase database)
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    documents.push(docInfo);
    localStorage.setItem('documents', JSON.stringify(documents));

    return { documentId, downloadUrl, qrCodeUrl };
  },

  /**
   * Get information about a document
   */
  async getDocumentInfo(documentId: string): Promise<DocumentInfo> {
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    const doc = documents.find((d: any) => d.id === documentId);
    
    if (!doc) {
      throw new Error('Document not found');
    }

    return doc;
  }
};