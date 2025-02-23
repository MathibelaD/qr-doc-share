<template>
  <main class="pt-20">
    <!-- Hero Section -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center" data-aos="fade-up">
          <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, Transparent <span class="text-primary">Pricing</span>
          </h1>
          <p class="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Choose the perfect plan for your document sharing needs
          </p>
        </div>

        <!-- Toggle Monthly/Annual -->
        <div class="mt-12 text-center" data-aos="fade-up" data-aos-delay="100">
            <div class="relative inline-flex items-center">
  <!-- Monthly Label -->
  <span
    class="mr-4 text-sm font-medium"
    :class="{ 'text-gray-900': !isAnnual, 'text-gray-500': isAnnual }"
  >
    Monthly
  </span>

  <!-- Toggle Switch -->
  <button
    @click="isAnnual = !isAnnual"
    type="button"
    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    :class="{ 'bg-primary': isAnnual, 'bg-gray-200': !isAnnual }"
    role="switch"
    :aria-checked="isAnnual"
  >
    <!-- <span
      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
      :class="{ 'translate-x-5': isAnnual, 'translate-x-0': !isAnnual }"
    /> -->
  </button>

  <!-- Annual Label -->
  <span
    class="ml-4 text-sm font-medium"
    :class="{ 'text-gray-900': isAnnual, 'text-gray-500': !isAnnual }"
  >
    Annual <span class="text-primary">(Save 20%)</span>
  </span>
</div>
        </div>
</div>
</section>
       <!-- Pricing Cards -->
    <div class="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <!-- Free Tier (as shown before) -->
      
      <!-- Pro Tier -->
      <div 
        class="bg-white rounded-xl p-8 border-2 border-primary relative transform hover:scale-105 transition-all"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div class="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
          Popular
        </div>
        <h3 class="text-lg font-semibold text-gray-900">Pro</h3>
        <p class="mt-4 text-sm text-gray-500">For professionals and small teams</p>
        <p class="mt-8">
          <span class="text-4xl font-bold text-gray-900">${{ isAnnual ? '24' : '29' }}</span>
          <span class="text-gray-500">/month</span>
        </p>
        <ul class="mt-8 space-y-4">
          <li class="flex items-start">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span class="text-gray-500">Unlimited documents</span>
          </li>
          <li class="flex items-start">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span class="text-gray-500">Custom QR code design</span>
          </li>
          <li class="flex items-start">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span class="text-gray-500">30-day document history</span>
          </li>
          <li class="flex items-start">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span class="text-gray-500">Priority support</span>
          </li>
          <li class="flex items-start">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span class="text-gray-500">Analytics dashboard</span>
          </li>
        </ul>
        <div class="mt-8">
          <router-link
            to="/try-now"
            class="block w-full text-center px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Start Free Trial
          </router-link>
        </div>
      </div>

      <!-- Enterprise Tier -->
      <div 
        class="bg-white rounded-xl p-8 border border-gray-200 hover:border-primary/20 hover:shadow-xl transition-all"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <h3 class="text-lg font-semibold text-gray-900">Enterprise</h3>
        <p class="mt-4 text-sm text-gray-500">For large organizations</p>
        <p class="mt-8">
          <span class="text-4xl font-bold text-gray-900">Custom</span>
        </p>
        <ul class="mt-8 space-y-4">
          <li class="flex items-start">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span class="text-gray-500">Everything in Pro</span>
          </li>
          <li class="flex items-start">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span class="text-gray-500">Unlimited team members</span>
          </li>
          <li class="flex items-start">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span class="text-gray-500">Advanced security features</span>
          </li>
          <li class="flex items-start">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span class="text-gray-500">Custom integration options</span>
          </li>
          <li class="flex items-start">
            <CheckIcon class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span class="text-gray-500">Dedicated account manager</span>
          </li>
        </ul>
        <div class="mt-8">
          <router-link
            to="/contact"
            class="block w-full text-center px-6 py-3 border border-primary text-primary font-medium rounded-md hover:bg-primary/5 transition-colors"
          >
            Contact Sales
          </router-link>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <section class="mt-24 bg-gray-50 py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          class="text-3xl font-bold text-center text-gray-900"
          data-aos="fade-up"
        >
          Frequently Asked Questions
        </h2>
        <div class="mt-12 space-y-8">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="bg-white rounded-lg p-6"
            data-aos="fade-up"
            :data-aos-delay="100 * index"
          >
            <h3 class="text-lg font-medium text-gray-900">{{ faq.question }}</h3>
            <p class="mt-2 text-gray-500">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckIcon } from '@heroicons/vue/24/outline'

const isAnnual = ref(false)

const faqs = [
  {
    question: "What happens after my free trial?",
    answer: "After your trial ends, you can choose to upgrade to a paid plan or continue with the free tier. We'll never automatically charge you."
  },
  {
    question: "Can I change plans later?",
    answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time. We'll prorate any payments automatically."
  },
  {
    question: "Is there a limit to file sizes?",
    answer: "Free plans can upload files up to 10MB, Pro plans up to 100MB, and Enterprise plans have custom limits."
  },
  {
    question: "How secure are my documents?",
    answer: "We use industry-standard encryption and security measures to protect your documents. Your files are encrypted both in transit and at rest."
  }
]
</script>