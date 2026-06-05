<template>
  <main class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Page Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Generate a QR Code</h1>
        <p class="mt-2 text-sm text-gray-500">Upload a document or paste a link — get a scannable QR code instantly</p>
      </div>

      <!-- Trial Used Banner -->
      <div v-if="!isAuthenticated && trialUsed" class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div class="flex items-start">
          <svg class="h-5 w-5 text-amber-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <h3 class="text-sm font-medium text-amber-800">Free trial used</h3>
            <p class="mt-1 text-sm text-amber-700">You've used your free trial. Create an account to generate unlimited QR codes.</p>
            <router-link to="/auth" class="mt-3 inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
              Sign Up Free
            </router-link>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex">
            <button
              @click="activeTab = 'document'"
              class="flex-1 py-4 px-4 text-sm font-medium text-center border-b-2 transition-colors"
              :class="activeTab === 'document' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
              <CloudArrowUpIcon class="h-5 w-5 inline-block mr-1.5 -mt-0.5" />
              Upload Document
            </button>
            <button
              @click="activeTab = 'link'"
              class="flex-1 py-4 px-4 text-sm font-medium text-center border-b-2 transition-colors"
              :class="activeTab === 'link' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
              <LinkIcon class="h-5 w-5 inline-block mr-1.5 -mt-0.5" />
              Paste a Link
            </button>
          </nav>
        </div>

        <div class="p-8">
          <!-- Document Upload Tab -->
          <div v-if="activeTab === 'document'">
            <!-- Step 1: Upload -->
            <div v-if="currentStep === 0">
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
                :class="{ 'border-primary bg-primary/5': isDragging }"
                @dragenter.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                <input
                  ref="fileInput"
                  type="file"
                  class="hidden"
                  @change="handleFileSelect"
                  accept=".pdf,.doc,.docx"
                />

                <div v-if="!selectedFile">
                  <CloudArrowUpIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <div class="mt-4">
                    <button @click="triggerFileInput" class="text-primary hover:text-primary/80 font-medium">
                      Upload a file
                    </button>
                    <span class="text-gray-500"> or drag and drop</span>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                </div>

                <div v-else>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <DocumentIcon class="h-6 w-6 text-gray-400" />
                      <span class="ml-2 text-sm text-gray-900">{{ selectedFile.name }}</span>
                    </div>
                    <button @click="clearFile" class="text-gray-400 hover:text-gray-500">
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    @click="startUpload"
                    class="mt-6 w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90"
                    :disabled="isUploading"
                  >
                    <span v-if="!isUploading">Generate QR Code</span>
                    <span v-else>Uploading... {{ uploadProgress }}%</span>
                  </button>
                </div>
              </div>

              <div v-if="uploadError" class="mt-4 p-4 bg-red-50 rounded-md">
                <div class="flex">
                  <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">Error</h3>
                    <div class="mt-1 text-sm text-red-700">{{ uploadError }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Processing -->
            <div v-if="currentStep === 1" class="text-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p class="mt-4 text-sm text-gray-500">Processing your document...</p>
            </div>

            <!-- Step 3: Success -->
            <div v-if="currentStep === 2">
              <QRResult
                :url="downloadUrl"
                title="Upload Complete!"
                subtitle="Your document QR code is ready to share"
                @download="downloadQR(downloadUrl)"
                @copy="copyToClipboard(downloadUrl)"
                @reset="clearFile"
              />
            </div>
          </div>

          <!-- Link Tab -->
          <div v-if="activeTab === 'link'">
            <div v-if="!linkGenerated">
              <div class="text-center mb-6">
                <GlobeAltIcon class="mx-auto h-12 w-12 text-gray-400" />
                <p class="mt-4 text-sm text-gray-500">Paste any website URL to generate a QR code</p>
              </div>

              <div class="flex flex-col sm:flex-row gap-3">
                <input
                  v-model="linkUrl"
                  type="url"
                  class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="https://example.com"
                  @keyup.enter="generateLinkQR"
                />
                <button
                  @click="generateLinkQR"
                  :disabled="!isValidUrl"
                  class="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Generate QR Code
                </button>
              </div>
              <p v-if="linkUrl && !isValidUrl" class="mt-2 text-sm text-red-500">Please enter a valid URL (e.g. https://example.com)</p>
              <p v-if="linkError" class="mt-2 text-sm text-red-500">{{ linkError }}</p>
            </div>

            <div v-else>
              <QRResult
                :url="linkUrl"
                title="QR Code Ready!"
                :subtitle="linkUrl"
                @download="downloadQR(linkUrl)"
                @copy="copyToClipboard(linkUrl)"
                @reset="resetLink"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<!-- QR Result inline component -->
<script lang="ts">
import { defineComponent, h } from 'vue'
import QRCodeVue3Comp from 'qrcode-vue3'
import { CheckCircleIcon as CheckIcon, ArrowDownTrayIcon as DownloadIcon, LinkIcon as CopyIcon, ArrowPathIcon as ResetIcon } from '@heroicons/vue/24/outline'

const QRResult = defineComponent({
  props: ['url', 'title', 'subtitle'],
  emits: ['download', 'copy', 'reset'],
  setup(props, { emit }) {
    return () => h('div', { class: 'text-center' }, [
      h('div', { class: 'mb-6' }, [
        h(CheckIcon, { class: 'h-10 w-10 text-green-500 mx-auto' }),
        h('h3', { class: 'mt-3 text-lg font-medium text-gray-900' }, props.title),
        h('p', { class: 'mt-1 text-sm text-gray-500 truncate max-w-md mx-auto' }, props.subtitle),
      ]),
      h('div', { class: 'bg-gray-50 p-6 rounded-lg inline-block' }, [
        h(QRCodeVue3Comp, { value: props.url, size: 280, level: 'H', 'render-as': 'svg' }),
      ]),
      h('div', { class: 'mt-6 flex flex-col sm:flex-row justify-center items-center gap-3' }, [
        h('button', { class: 'inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50', onClick: () => emit('download') }, [
          h(DownloadIcon, { class: 'h-4 w-4 mr-2' }), 'Download QR'
        ]),
        h('button', { class: 'inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50', onClick: () => emit('copy') }, [
          h(CopyIcon, { class: 'h-4 w-4 mr-2' }), 'Copy Link'
        ]),
        h('button', { class: 'inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50', onClick: () => emit('reset') }, [
          h(ResetIcon, { class: 'h-4 w-4 mr-2' }), 'New QR'
        ]),
      ]),
    ])
  }
})

export default { components: { QRResult } }
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import QRCodeVue3 from 'qrcode-vue3'
import { DocumentService } from '../services/DocumentService'
import { supabase } from '../services/supabase'
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  LinkIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const activeTab = ref<'document' | 'link'>('document')

// Auth state
const isAuthenticated = ref(false)
const trialUsed = ref(false)

// Document upload state
const downloadUrl = ref('')
const uploadProgress = ref(0)
const isUploading = ref(false)
const uploadError = ref<string | null>(null)
const currentStep = ref(0)
const isDragging = ref(false)
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement>()

// Link QR state
const linkUrl = ref('')
const linkGenerated = ref(false)
const linkError = ref('')

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  isAuthenticated.value = !!user
  trialUsed.value = localStorage.getItem('trialUsed') === 'true'
})

const isValidUrl = computed(() => {
  try {
    new URL(linkUrl.value)
    return true
  } catch {
    return false
  }
})

// Document upload methods
const triggerFileInput = () => fileInput.value?.click()

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files?.length) validateAndSetFile(files[0])
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.length) validateAndSetFile(input.files[0])
}

const validateAndSetFile = (file: File) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) { alert('Invalid file type. Please upload PDF or DOC files.'); return }
  if (file.size > 10 * 1024 * 1024) { alert('File too large. Maximum size is 10MB.'); return }
  selectedFile.value = file
  uploadError.value = null
}

const clearFile = () => {
  selectedFile.value = null
  downloadUrl.value = ''
  uploadError.value = null
  uploadProgress.value = 0
  currentStep.value = 0
  if (fileInput.value) fileInput.value.value = ''
}

const startUpload = async () => {
  if (!selectedFile.value) return
  if (!isAuthenticated.value && trialUsed.value) {
    uploadError.value = 'Your free trial has been used. Please sign up to continue.'
    return
  }

  currentStep.value = 1
  isUploading.value = true
  uploadError.value = null

  try {
    const data = await DocumentService.uploadDocument(selectedFile.value, (progress) => {
      uploadProgress.value = progress
    })
    downloadUrl.value = data.downloadUrl
    if (!isAuthenticated.value) {
      localStorage.setItem('trialUsed', 'true')
      trialUsed.value = true
    }
    currentStep.value = 2
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : String(err)
    currentStep.value = 0
  } finally {
    isUploading.value = false
  }
}

// Link QR methods
const generateLinkQR = () => {
  if (!isValidUrl.value) return
  if (!isAuthenticated.value && trialUsed.value) {
    linkError.value = 'Your free trial has been used. Please sign up to continue.'
    return
  }
  linkGenerated.value = true
  if (!isAuthenticated.value) {
    localStorage.setItem('trialUsed', 'true')
    trialUsed.value = true
  }
}

const resetLink = () => {
  linkUrl.value = ''
  linkGenerated.value = false
  linkError.value = ''
}

// Shared methods
const downloadQR = async (url: string) => {
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 512, margin: 2, color: { dark: '#000000', light: '#FFFFFF' }
  })
  const link = document.createElement('a')
  link.href = qrDataUrl
  link.download = 'qrcode.png'
  link.click()
}

const copyToClipboard = async (url: string) => {
  await navigator.clipboard.writeText(url)
  alert('Link copied to clipboard!')
}
</script>
