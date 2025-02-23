<template>
  <nav class="bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-gray-100" data-aos="fade-down" data-aos-duration="800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center group">
            <QrCodeIcon class="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <span class="ml-2 text-xl font-semibold text-gray-900">QR Share</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex md:items-center md:space-x-1">
          <router-link 
            v-for="item in navigationItems" 
            :key="item.name"
            :to="item.to"
            class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-md transition-colors relative group"
            :class="{ 'text-primary': $route.path === item.to }"
          >
            {{ item.name }}
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </router-link>

          <!-- Primary CTA Button -->
          <div class="ml-6 relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <router-link 
              to="/upload"
              class="relative flex items-center px-6 py-3 bg-white rounded-lg leading-none"
            >
              <span class="pr-6 font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Try it Free
              </span>
              <ArrowRightIcon class="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
            </router-link>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button 
            @click="isOpen = !isOpen" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Bars3Icon v-if="!isOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div 
        v-show="isOpen" 
        class="md:hidden"
        @click.self="isOpen = false"
      >
        <div 
          class="pt-2 pb-3 space-y-1"
          data-aos="fade-down"
          data-aos-duration="400"
        >
          <router-link 
            v-for="item in navigationItems" 
            :key="item.name"
            :to="item.to"
            class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            :class="{ 'text-primary': $route.path === item.to }"
            @click="isOpen = false"
          >
            {{ item.name }}
          </router-link>

          <!-- Mobile CTA -->
          <router-link 
            to="/upload"
            class="block mt-4 mx-4 px-4 py-3 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-lg text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
            @click="isOpen = false"
          >
            Try it Free
            <ArrowRightIcon class="h-5 w-5 inline-block ml-2" />
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QrCodeIcon, Bars3Icon, XMarkIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

const isOpen = ref(false)

const navigationItems = [
  { name: 'Home', to: '/' },
  { name: 'Features', to: '/features' },
  { name: 'How it Works', to: '/#how-it-works' },
]

// Optional: Close mobile menu when route changes
import { watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
watch(() => route.path, () => {
  isOpen.value = false
})
</script>

<style scoped>
@keyframes tilt {
  0%, 100% { transform: rotate(-1deg); }
  50% { transform: rotate(1deg); }
}

.animate-tilt {
  animation: tilt 10s infinite linear;
}
</style>