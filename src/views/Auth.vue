<template>
  <main class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full px-4 py-12">
      <div class="bg-white rounded-xl shadow-sm p-8">

        <!-- Step 1: Sign Up / Sign In -->
        <div v-if="step === 'auth'">
          <h2 class="text-2xl font-bold text-center text-gray-900 mb-2">
            {{ isLogin ? 'Welcome Back' : 'Create Account' }}
          </h2>
          <p class="text-center text-sm text-gray-500 mb-8">
            {{ isLogin ? 'Sign in to access your documents' : 'Sign up to start sharing documents' }}
          </p>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                v-model="password"
                type="password"
                required
                minlength="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="••••••••"
              />
              <p v-if="!isLogin" class="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-700">{{ errorMessage }}</p>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <span v-if="!loading">{{ isLogin ? 'Sign In' : 'Sign Up' }}</span>
              <span v-else>{{ isLogin ? 'Signing in...' : 'Creating account...' }}</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="my-6 flex items-center">
            <div class="flex-1 border-t border-gray-300"></div>
            <span class="px-4 text-sm text-gray-500">or</span>
            <div class="flex-1 border-t border-gray-300"></div>
          </div>

          <!-- Google Sign In -->
          <button
            @click="handleGoogleSignIn"
            class="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="text-sm font-medium text-gray-700">Continue with Google</span>
          </button>

          <!-- Toggle Login/Register -->
          <p class="mt-6 text-center text-sm text-gray-500">
            {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
            <button
              @click="toggleMode"
              class="text-primary font-medium hover:text-primary/80"
            >
              {{ isLogin ? 'Sign Up' : 'Sign In' }}
            </button>
          </p>
        </div>

        <!-- Step 2: OTP Verification (after signup) -->
        <div v-else-if="step === 'verify'">
          <h2 class="text-2xl font-bold text-center text-gray-900 mb-2">Verify your email</h2>
          <p class="text-center text-sm text-gray-500 mb-8">
            We sent a 6-digit code to <strong>{{ email }}</strong>
          </p>

          <form @submit.prevent="verifyCode" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Verification code</label>
              <input
                v-model="otpCode"
                type="text"
                required
                maxlength="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                autofocus
              />
            </div>

            <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-md">
              <p class="text-sm text-red-700">{{ errorMessage }}</p>
            </div>

            <button
              type="submit"
              :disabled="loading || otpCode.length < 6"
              class="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <span v-if="!loading">Verify & Continue</span>
              <span v-else>Verifying...</span>
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500">
              Didn't receive the code?
              <button
                @click="resendCode"
                :disabled="resendCooldown > 0"
                class="text-primary font-medium hover:text-primary/80 disabled:text-gray-400"
              >
                {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code' }}
              </button>
            </p>
            <button
              @click="step = 'auth'; errorMessage = ''"
              class="mt-2 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to sign up
            </button>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '../services/AuthService'

const router = useRouter()
const step = ref<'auth' | 'verify'>('auth')
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const otpCode = ref('')
const loading = ref(false)
const errorMessage = ref('')
const resendCooldown = ref(0)
let cooldownInterval: ReturnType<typeof setInterval> | null = null

const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
}

const startCooldown = () => {
  resendCooldown.value = 60
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownInterval) {
      clearInterval(cooldownInterval)
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})

const handleSubmit = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    if (isLogin.value) {
      await AuthService.signIn(email.value, password.value)
      router.push('/dashboard')
    } else {
      await AuthService.signUp(email.value, password.value)
      step.value = 'verify'
      startCooldown()
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}

const verifyCode = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await AuthService.verifyOtp(email.value, otpCode.value)
    router.push('/dashboard')
  } catch (err: any) {
    errorMessage.value = err.message || 'Invalid code. Please try again.'
  } finally {
    loading.value = false
  }
}

const resendCode = async () => {
  if (resendCooldown.value > 0) return
  try {
    await AuthService.resendVerification(email.value)
    startCooldown()
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to resend code'
  }
}

const handleGoogleSignIn = async () => {
  try {
    await AuthService.signInWithGoogle()
  } catch (err: any) {
    errorMessage.value = err.message || 'Google sign-in failed'
  }
}
</script>
