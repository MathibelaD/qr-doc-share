<template>
  <main class="pt-20">
    <!-- Hero Section -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center" data-aos="fade-up">
          <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl">
            Powerful Features for <span class="text-primary">Seamless</span> Sharing
          </h1>
          <p class="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Everything you need to share documents securely and efficiently with QR codes
          </p>
        </div>
      </div>
    </section>

    <!-- Main Features Grid -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <!-- Secure Storage -->
          <div 
            class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <LockClosedIcon class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Secure Storage</h3>
            <ul class="space-y-3 text-gray-500">
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                End-to-end encryption
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Automatic file backup
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Access control management
              </li>
            </ul>
          </div>

          <!-- QR Code Generation -->
          <div 
            class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <QrCodeIcon class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">QR Code Generation</h3>
            <ul class="space-y-3 text-gray-500">
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Custom QR code design
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                High resolution export
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Bulk generation available
              </li>
            </ul>
          </div>

          <!-- File Management -->
          <div 
            class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <FolderIcon class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">File Management</h3>
            <ul class="space-y-3 text-gray-500">
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Multiple file formats
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Version control
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                File organization tools
              </li>
            </ul>
          </div>

          <!-- Analytics -->
          <div 
            class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <ChartBarIcon class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Analytics</h3>
            <ul class="space-y-3 text-gray-500">
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Access tracking
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Usage statistics
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Download reports
              </li>
            </ul>
          </div>

          <!-- Collaboration -->
          <div 
            class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <UserGroupIcon class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Collaboration</h3>
            <ul class="space-y-3 text-gray-500">
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Team sharing
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Permission settings
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Activity tracking
              </li>
            </ul>
          </div>

          <!-- Mobile Access -->
          <div 
            class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
              <DevicePhoneMobileIcon class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Mobile Access</h3>
            <ul class="space-y-3 text-gray-500">
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Responsive design
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Mobile app available
              </li>
              <li class="flex items-center">
                <CheckIcon class="w-5 h-5 text-green-500 mr-2" />
                Offline access
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-white py-16">
      <div 
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        data-aos="fade-up"
      >
        <h2 class="text-3xl font-bold text-gray-900">Ready to get started?</h2>
        <p class="mt-4 text-xl text-gray-500">
          Start sharing your documents securely with QR codes today.
        </p>
        <div class="mt-8">
          <router-link
            to="/try-now"
            class="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Try it Free
            <ArrowRightIcon class="ml-2 h-5 w-5" />
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { 
  LockClosedIcon, 
  QrCodeIcon, 
  FolderIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  DevicePhoneMobileIcon,
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'
</script>