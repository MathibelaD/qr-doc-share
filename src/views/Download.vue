// src/views/Download.vue
<template>
  <main class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <div class="bg-white rounded-xl shadow-sm p-8 text-center">
        <!-- Loading state -->
        <div v-if="loading" class="py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p class="mt-4 text-sm text-gray-500">Loading document information...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="py-8">
          <ExclamationCircleIcon class="h-12 w-12 text-red-500 mx-auto" />
          <h2 class="mt-4 text-lg font-medium text-gray-900">Something went wrong</h2>
          <p class="mt-2 text-sm text-gray-500">{{ error }}</p>
          <router-link 
            to="/" 
            class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            Back to Home
          </router-link>
        </div>
        
        <!-- Document info and download -->
        <div v-else class="py-8">
          <DocumentIcon class="h-12 w-12 text-primary mx-auto" />
          <h2 class="mt-4 text-xl font-semibold text-gray-900">Document Ready</h2>
          
          <div class="mt-8 bg-gray-50 p-6 rounded-lg text-left">
            <h3 class="text-lg font-medium text-gray-900">{{ documentInfo.originalName }}</h3>
            <div class="mt-2 text-sm text-gray-500 space-y-1">
              <p>Type: {{ formatFileType(documentInfo.mimeType) }}</p>
              <p>Size: {{ formatFileSize(documentInfo.size) }}</p>
              <p>Uploaded: {{ formatDate(documentInfo.uploadDate) }}</p>
            </div>
          </div>
          
          <a 
            :href="downloadUrl" 
            download
            class="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 shadow-sm"
          >
            <ArrowDownTrayIcon class="h-5 w-5 mr-2" />
            Download Document
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { DocumentService } from '@/services/DocumentService';
import type { DocumentInfo } from '@/services/DocumentService';
import { DocumentIcon, ExclamationCircleIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const documentId = route.params.id as string;
const documentInfo = ref<DocumentInfo>({} as DocumentInfo);
const loading = ref(true);
const error = ref<string | null>(null);
const downloadUrl = ref('');

onMounted(async () => {
  try {
    // Get document info
    const info = await DocumentService.getDocumentInfo(documentId);
    documentInfo.value = info;
    
    // Get the actual Supabase file URL
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(info.fileName);
    
    downloadUrl.value = publicUrl;
    
    loading.value = false;
  } catch (err: any) {
    loading.value = false;
    error.value = err.message || 'Failed to load document information';
    console.error('Error fetching document:', err);
  }
});

// Helper functions
function formatFileType(mimeType: string): string {
  const types: Record<string, string> = {
    'application/pdf': 'PDF Document',
    'application/msword': 'Word Document (.doc)',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document (.docx)'
  };
  
  return types[mimeType] || mimeType;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>