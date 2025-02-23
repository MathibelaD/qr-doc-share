<template>
  <main>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-white mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div class="lg:grid lg:grid-cols-12 lg:gap-8">
          <div 
            class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Share Documents <span class="text-primary">Securely</span> with QR Codes
            </h1>
            <p class="mt-6 text-lg text-gray-500">
              Upload your documents and share them instantly with a QR code. Simple, secure, and efficient document sharing for everyone.
            </p>
            <div class="mt-8 sm:flex sm:justify-center lg:justify-start">
              <div class="rounded-md shadow" data-aos="fade-up" data-aos-delay="200">
                <router-link to="/upload" class="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors">
                  Upload Document
                </router-link>
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-3" data-aos="fade-up" data-aos-delay="300">
                <a href="#how-it-works" class="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
                  Learn More
                </a>
              </div>
            </div>
          </div>
          <div 
            class="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
            data-aos="fade-left"
            data-aos-duration="1000"
          >
            <div class="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div class="relative block w-full bg-white rounded-lg overflow-hidden">
                <HeroIllustration class="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-gray-50 py-16 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center" data-aos="fade-up">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose Our Service?
          </h2>
          <p class="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            Simple, secure, and efficient document sharing solution for businesses and individuals.
          </p>
        </div>

        <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div 
            class="bg-white rounded-lg shadow-sm p-6" 
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <LockClosedIcon class="w-6 h-6 text-primary" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">Secure Sharing</h3>
            <p class="mt-2 text-gray-500">Your documents are encrypted and securely stored. Only those with the QR code can access them.</p>
          </div>

          <div 
            class="bg-white rounded-lg shadow-sm p-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <BoltIcon class="w-6 h-6 text-primary" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">Instant Access</h3>
            <p class="mt-2 text-gray-500">Generate QR codes instantly and share documents with anyone, anywhere, anytime.</p>
          </div>

          <div 
            class="bg-white rounded-lg shadow-sm p-6"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DevicePhoneMobileIcon class="w-6 h-6 text-primary" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">Mobile Friendly</h3>
            <p class="mt-2 text-gray-500">Access your documents on any device. Our platform is fully responsive and mobile-friendly.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="bg-white py-16 sm:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center" data-aos="fade-up">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p class="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            Share your documents in three simple steps
          </p>
        </div>

        <div class="mt-16">
          <div class="grid gap-8 md:grid-cols-3">
            <div 
              class="text-center"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <ArrowUpTrayIcon class="w-8 h-8 text-primary" />
              </div>
              <h3 class="mt-4 text-lg font-semibold text-gray-900">1. Upload</h3>
              <p class="mt-2 text-gray-500">Upload your document to our secure platform</p>
            </div>

            <div 
              class="text-center"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <QrCodeIcon class="w-8 h-8 text-primary" />
              </div>
              <h3 class="mt-4 text-lg font-semibold text-gray-900">2. Get QR Code</h3>
              <p class="mt-2 text-gray-500">Receive a unique QR code for your document</p>
            </div>

            <div 
              class="text-center"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <ShareIcon class="w-8 h-8 text-primary" />
              </div>
              <h3 class="mt-4 text-lg font-semibold text-gray-900">3. Share</h3>
              <p class="mt-2 text-gray-500">Share the QR code with anyone who needs access</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary">
      <div 
        class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <span class="block">Ready to get started?</span>
          <span class="block text-primary-100">Try our service today.</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <router-link to="/upload" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50">
              Upload Now
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { LockClosedIcon, BoltIcon, DevicePhoneMobileIcon, ArrowUpTrayIcon, QrCodeIcon, ShareIcon } from '@heroicons/vue/24/outline'
import HeroIllustration from '@/components/icons/HeroIllustration.vue'
</script>