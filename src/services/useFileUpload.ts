// src/composables/useFileUpload.ts
import { ref } from 'vue';
import { DocumentService } from '@/services/DocumentService';

export function useFileUpload() {
  const uploadProgress = ref(0);
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);
  const downloadUrl = ref('');
  const qrCodeUrl = ref('');
  const documentId = ref('');

  async function uploadFile(file: File) {
    try {
      isUploading.value = true;
      uploadError.value = null;
      
      // Update progress as upload proceeds
      const response = await DocumentService.uploadDocument(file, (progress) => {
        uploadProgress.value = progress;
      });
      
      // Store the response data
      downloadUrl.value = response.downloadUrl;
      qrCodeUrl.value = response.qrCodeUrl;
      documentId.value = response.documentId;
      
      return response;
    } catch (error: any) {
      console.error('Upload error:', error);
      uploadError.value = error.response?.data?.error || error.message || 'Upload failed';
      throw error;
    } finally {
      isUploading.value = false;
    }
  }

  return {
    uploadFile,
    uploadProgress,
    isUploading,
    uploadError,
    downloadUrl,
    qrCodeUrl,
    documentId
  };
}