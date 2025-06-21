// src/services/DocumentService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
  uploadDate: string;
  accessCount: number;
}

export const DocumentService = {
  /**
   * Upload a document to the server
   */
  async uploadDocument(file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<UploadResponse>(`${API_URL}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });

    return response.data;
  },

  /**
   * Get information about a document
   */
  async getDocumentInfo(documentId: string): Promise<DocumentInfo> {
    const response = await axios.get<DocumentInfo>(`${API_URL}/documents/${documentId}/info`);
    return response.data;
  }
};