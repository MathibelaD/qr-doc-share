// src/firebase/index.ts
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const db = getFirestore(app)

export { storage, db }



// Usage in your component
// <script setup lang="ts">
// import { useFileUpload } from '@/composables/useFileUpload'

// const {
//   uploadFile,
//   uploadProgress,
//   isUploading,
//   uploadError,
//   qrCodeUrl
// } = useFileUpload()

// const handleFileUpload = async (file: File) => {
//   await uploadFile(file)
// }
// </script>

