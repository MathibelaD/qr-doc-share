<template>
  <main class="min-h-screen bg-gray-50 pt-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Upload Status Steps -->
      <div class="mb-12">
        <div class="flex flex-wrap justify-center gap-6 sm:gap-12">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="flex items-center"
          >
            <div
              class="flex flex-col items-center"
              :class="{ 'opacity-50': currentStep < index }"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2"
                :class="[
                  currentStep > index ? 'bg-primary border-primary' :
                  currentStep === index ? 'border-primary' :
                  'border-gray-300'
                ]"
              >
                <component
                  :is="step.icon"
                  class="w-5 h-5"
                  :class="currentStep > index ? 'text-white' : 'text-gray-500'"
                />
              </div>
              <span class="text-sm font-medium text-gray-900">{{ step.name }}</span>
            </div>

            <div
              v-if="index < steps.length - 1"
              class="w-12 h-0.5 mx-2 sm:mx-4"
              :class="currentStep > index ? 'bg-primary' : 'bg-gray-300'"
            />
          </div>
        </div>
      </div>

      <!-- Upload Zone -->
      <div class="bg-white rounded-xl shadow-sm p-8">
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
                <button @click="triggerFileInput" class="text-primary hover:text-primary/80">
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
                class="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                :disabled="isUploading"
              >
                <span v-if="!isUploading">Start Upload</span>
                <span v-else>Uploading... {{ uploadProgress }}%</span>
              </button>
            </div>
          </div>

          <div v-if="uploadError" class="mt-4 p-4 bg-red-50 rounded-md">
            <div class="flex">
              <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Upload Error</h3>
                <div class="mt-2 text-sm text-red-700">{{ uploadError }}</div>
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
        <div v-if="currentStep === 2" class="text-center">
          <div class="mb-8">
            <CheckCircleIcon class="h-12 w-12 text-green-500 mx-auto" />
            <h3 class="mt-4 text-lg font-medium text-gray-900">Upload Complete!</h3>
            <p class="mt-1 text-sm text-gray-500">Your document has been uploaded successfully</p>
          </div>

          <div class="bg-gray-50 p-6 rounded-lg inline-block max-w-full overflow-auto">
            <QRCodeVue3
              :value="downloadUrl"
              :size="300"
              level="H"
              class="mx-auto qrcode"
              render-as="svg"
            />
          </div>

          <div class="mt-8 space-y-4">
            <p class="text-sm text-gray-500">
              Share this QR code with others to give them access to your document
            </p>
            <div class="flex flex-col sm:flex-row justify-center items-center sm:space-x-4 space-y-4 sm:space-y-0">
              <button
                @click="downloadQR"
                class="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
                Download QR
              </button>
              <button
                @click="copyLink"
                class="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <LinkIcon class="h-4 w-4 mr-2" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import QRCode from 'qrcode'
import QRCodeVue3 from 'qrcode-vue3'
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowDownTrayIcon,
  LinkIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const qrCodeUrl = ref('')
const downloadUrl = ref('')

const uploadProgress = ref(0)
const isUploading = ref(false)
const uploadError = ref<string | null>(null)

const currentStep = ref(0)
const isDragging = ref(false)
const selectedFile = ref<File | null>(null)

const fileInput = ref<HTMLInputElement>()

// Steps configuration for UI
const steps = [
  { id: 1, name: 'Upload', icon: CloudArrowUpIcon },
  { id: 2, name: 'Process', icon: DocumentIcon },
  { id: 3, name: 'Share', icon: LinkIcon }
]

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files?.length) {
    validateAndSetFile(files[0])
  }
}

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    validateAndSetFile(input.files[0])
  }
}

const validateAndSetFile = (file: File) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!allowedTypes.includes(file.type)) {
    alert('Invalid file type. Please upload PDF or DOC files.')
    return
  }

  if (file.size > maxSize) {
    alert('File too large. Maximum size is 10MB.')
    return
  }

  selectedFile.value = file
  uploadError.value = null
}

const clearFile = () => {
  selectedFile.value = null
  qrCodeUrl.value = ''
  downloadUrl.value = ''
  uploadError.value = null
  uploadProgress.value = 0
  currentStep.value = 0
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const uploadFileToServer = async (file: File) => {
  isUploading.value = true
  uploadError.value = null
  uploadProgress.value = 0

  const formData = new FormData()
  formData.append('document', file)

  try {
    const res = await fetch('/api/documents', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}`)
    }

    const data = await res.json()
    if (!data.downloadUrl) throw new Error("No downloadUrl received from server")

    downloadUrl.value = data.downloadUrl

    // Generate QR code image (data URL) from the download link
    const qr = await QRCode.toDataURL(data.downloadUrl)
    qrCodeUrl.value = qr

    isUploading.value = false
    return true
  } catch (err) {
    uploadError.value = err instanceof Error ? err.message : String(err)
    isUploading.value = false
    return false
  }
}

const startUpload = async () => {
  if (!selectedFile.value) return
  currentStep.value = 1 // Processing step
  const success = await uploadFileToServer(selectedFile.value)

  if (success) {
    currentStep.value = 2 // Success step
  } else {
    currentStep.value = 0 // Back to upload step on failure
  }
}

// Download QR code as PNG
const downloadQR = () => {
  setTimeout(() => {
    const svg = document.querySelector('.qrcode svg') || document.querySelector('svg')
    if (!svg) {
      alert('QR code not found to download')
      return
    }

    try {
      const canvas = document.createElement('canvas')
      const rect = svg.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')

      const svgData = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(url)

        const pngUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = 'qrcode.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      img.src = url
    } catch (error) {
      alert('Failed to download QR code.')
      console.error(error)
    }
  }, 100)
}

// Copy the raw download link to clipboard
const copyLink = async () => {
  try {
    if (!downloadUrl.value) {
      alert('No link to copy')
      return
    }
    await navigator.clipboard.writeText(downloadUrl.value)
    alert('Link copied to clipboard!')
  } catch (err) {
    alert('Failed to copy link.')
    console.error('Failed to copy link:', err)
  }
}
</script>
