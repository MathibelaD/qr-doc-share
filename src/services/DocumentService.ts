// src/services/DocumentService.ts
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResponse {
  documentId: string;
  downloadUrl: string;
  qrCodeUrl: string;
}

export interface DocumentInfo {
  id: string;
  document_id: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  file_name: string;
  upload_date: string;
  expires_at: string;
  access_count: number;
  user_id: string;
}

export const DocumentService = {
  /**
   * Upload a document to Supabase Storage + save metadata to DB
   */
  async uploadDocument(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    const { data: { user } } = await supabase.auth.getUser();
    const documentId = uuidv4();
    const fileName = `${Date.now()}_${file.name}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Calculate expiration (5 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 5);

    // Save metadata to database
    const { error: dbError } = await supabase
      .from('documents')
      .insert({
        document_id: documentId,
        original_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        file_name: fileName,
        expires_at: expiresAt.toISOString(),
        user_id: user?.id || null
      });

    if (dbError) {
      console.error('Failed to save metadata:', dbError);
    }

    return {
      documentId,
      downloadUrl: publicUrl,
      qrCodeUrl: publicUrl
    };
  },

  /**
   * Get all documents for the current user
   */
  async getUserDocuments(): Promise<DocumentInfo[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('upload_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get document info by document_id
   */
  async getDocumentInfo(documentId: string): Promise<DocumentInfo> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('document_id', documentId)
      .single();

    if (error || !data) throw new Error('Document not found');

    // Check expiration
    if (new Date(data.expires_at) < new Date()) {
      throw new Error('Document has expired and is no longer available');
    }

    return data;
  },

  /**
   * Delete a document
   */
  async deleteDocument(doc: DocumentInfo): Promise<void> {
    // Delete from storage
    await supabase.storage
      .from('documents')
      .remove([doc.file_name]);

    // Delete from database
    await supabase
      .from('documents')
      .delete()
      .eq('document_id', doc.document_id);
  },

  /**
   * Get public URL for a file
   */
  getPublicUrl(fileName: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);
    return publicUrl;
  }
};
