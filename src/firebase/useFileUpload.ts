import { ref } from 'vue'
import { storage, db } from '@/firebase'
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage'
import {
  collection,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore'

export function useFileUpload() {
  const uploadProgress = ref(0)
  const isUploading = ref(false)
  const uploadError = ref<string | null>(null)
  const downloadUrl = ref('')
  const qrCodeUrl = ref('')

  async function uploadFile(file: File) {
    try {
      isUploading.value = true
      uploadError.value = null
      
      // Create a document reference with auto-generated ID
      const docRef = doc(collection(db, 'documents'))
      const fileId = docRef.id // Use Firebase's built-in ID generator
      
      // Create storage reference
      const fileRef = storageRef(storage, `documents/${fileId}/${file.name}`)
      
      // Start upload
      const uploadTask = uploadBytesResumable(fileRef, file)
      
      // Monitor upload progress
      uploadTask.on('state_changed', 
        (snapshot) => {
          uploadProgress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        (error) => {
          uploadError.value = error.message
          isUploading.value = false
        },
        async () => {
          // Upload completed successfully
          const url = await getDownloadURL(fileRef)
          downloadUrl.value = url
          
          // Save document metadata to Firestore using the pre-generated ID
          await setDoc(docRef, {
            fileId,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            downloadUrl: url,
            createdAt: serverTimestamp(),
            accessCount: 0
          })
          
          // Generate QR code URL
          qrCodeUrl.value = `https://yourapp.com/d/${fileId}`
          
          isUploading.value = false
        }
      )
    } catch (error: any) {
      uploadError.value = error.message
      isUploading.value = false
    }
  }

  return {
    uploadFile,
    uploadProgress,
    isUploading,
    uploadError,
    downloadUrl,
    qrCodeUrl
  }
}