<template>
  <main class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Documents</h1>
          <p class="text-sm text-gray-500 mt-1">Manage your uploaded documents and QR codes</p>
        </div>
        <router-link
          to="/upload"
          class="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Upload New
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-sm text-gray-500">Loading documents...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="documents.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm">
        <DocumentIcon class="h-12 w-12 text-gray-300 mx-auto" />
        <h3 class="mt-4 text-lg font-medium text-gray-900">No documents yet</h3>
        <p class="mt-2 text-sm text-gray-500">Upload your first document to get started</p>
        <router-link
          to="/upload"
          class="mt-6 inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
        >
          Upload Document
        </router-link>
      </div>

      <!-- Documents Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="doc in documents"
          :key="doc.document_id"
          class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <!-- File Icon & Name -->
          <div class="flex items-start justify-between">
            <div class="flex items-center min-w-0">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" :class="getFileColor(doc.mime_type)">
                <DocumentTextIcon class="h-5 w-5 text-white" />
              </div>
              <div class="ml-3 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ doc.original_name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(doc.file_size) }}</p>
              </div>
            </div>
            <button @click="deleteDoc(doc)" class="text-gray-400 hover:text-red-500 transition-colors">
              <TrashIcon class="h-4 w-4" />
            </button>
          </div>

          <!-- Expiration -->
          <div class="mt-4 flex items-center text-xs" :class="isExpired(doc) ? 'text-red-500' : 'text-gray-500'">
            <ClockIcon class="h-3.5 w-3.5 mr-1" />
            <span v-if="isExpired(doc)">Expired</span>
            <span v-else>Expires {{ formatTimeLeft(doc.expires_at) }}</span>
          </div>

          <!-- Actions -->
          <div v-if="!isExpired(doc)" class="mt-4 flex gap-2">
            <button
              @click="copyLink(doc)"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LinkIcon class="h-3.5 w-3.5 mr-1" />
              Copy Link
            </button>
            <button
              @click="showQR(doc)"
              class="flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              <QrCodeIcon class="h-3.5 w-3.5 mr-1" />
              QR Code
            </button>
          </div>
        </div>
      </div>

      <!-- QR Code Modal -->
      <div v-if="showQRModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showQRModal = false">
        <div class="bg-white rounded-xl p-8 max-w-sm w-full text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-4">{{ selectedDoc?.original_name }}</h3>
          <div class="bg-gray-50 p-4 rounded-lg inline-block">
            <QRCodeVue3
              :value="selectedDocUrl"
              :size="250"
              level="H"
              render-as="svg"
            />
          </div>
          <div class="mt-6 flex gap-3">
            <button
              @click="downloadQR"
              class="flex-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90"
            >
              Download QR
            </button>
            <button
              @click="showQRModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'
import QRCodeVue3 from 'qrcode-vue3'
import { DocumentService } from '../services/DocumentService'
import type { DocumentInfo } from '../services/DocumentService'
import {
  DocumentIcon,
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  LinkIcon,
  ClockIcon,
  QrCodeIcon
} from '@heroicons/vue/24/outline'

const documents = ref<DocumentInfo[]>([])
const loading = ref(true)
const showQRModal = ref(false)
const selectedDoc = ref<DocumentInfo | null>(null)
const selectedDocUrl = ref('')

onMounted(async () => {
  await loadDocuments()
})

const loadDocuments = async () => {
  try {
    loading.value = true
    documents.value = await DocumentService.getUserDocuments()
  } catch (err) {
    console.error('Failed to load documents:', err)
  } finally {
    loading.value = false
  }
}

const deleteDoc = async (doc: DocumentInfo) => {
  if (!confirm(`Delete "${doc.original_name}"?`)) return
  try {
    await DocumentService.deleteDocument(doc)
    documents.value = documents.value.filter(d => d.document_id !== doc.document_id)
  } catch (err) {
    alert('Failed to delete document')
  }
}

const copyLink = (doc: DocumentInfo) => {
  const url = DocumentService.getPublicUrl(doc.file_name)
  navigator.clipboard.writeText(url)
  alert('Link copied!')
}

const showQR = (doc: DocumentInfo) => {
  selectedDoc.value = doc
  selectedDocUrl.value = DocumentService.getPublicUrl(doc.file_name)
  showQRModal.value = true
}

const downloadQR = async () => {
  if (!selectedDocUrl.value) return
  const qrDataUrl = await QRCode.toDataURL(selectedDocUrl.value, {
    width: 512,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' }
  })
  const link = document.createElement('a')
  link.href = qrDataUrl
  link.download = `qr-${selectedDoc.value?.original_name || 'code'}.png`
  link.click()
}

const isExpired = (doc: DocumentInfo) => new Date(doc.expires_at) < new Date()

const getFileColor = (mimeType: string) => {
  if (mimeType === 'application/pdf') return 'bg-red-500'
  return 'bg-blue-500'
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const formatTimeLeft = (expiresAt: string) => {
  const now = new Date()
  const expires = new Date(expiresAt)
  const diff = expires.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) return `in ${days}d ${hours}h`
  if (hours > 0) return `in ${hours}h`
  return 'soon'
}
</script>
