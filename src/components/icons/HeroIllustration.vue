<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" :class="className">
    <!-- Background Elements -->
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.1"/>
      </pattern>
    </defs>
    
    <!-- Background Grid -->
    <rect width="800" height="600" fill="#f8fafc"/>
    <rect width="800" height="600" fill="url(#grid)" opacity="0.3"/>
    
    <!-- Main Document -->
    <g transform="translate(250, 150)">
      <!-- Document Base -->
      <rect x="0" y="0" width="300" height="380" rx="8" fill="#ffffff" stroke="currentColor" stroke-width="2"/>
      
      <!-- Document Lines -->
      <g fill="currentColor" opacity="0.2">
        <rect x="30" y="60" width="240" height="4" rx="2"/>
        <rect x="30" y="90" width="180" height="4" rx="2"/>
        <rect x="30" y="120" width="220" height="4" rx="2"/>
        <rect x="30" y="150" width="200" height="4" rx="2"/>
      </g>
      
      <!-- QR Code Area -->
      <rect x="85" y="200" width="130" height="130" rx="4" fill="currentColor" opacity="0.1"/>
      <g transform="translate(100, 215)">
        <!-- Simplified QR Code Pattern -->
        <rect width="100" height="100" fill="none" stroke="currentColor" stroke-width="2"/>
        <g fill="currentColor">
          <rect x="10" y="10" width="20" height="20"/>
          <rect x="70" y="10" width="20" height="20"/>
          <rect x="10" y="70" width="20" height="20"/>
          <rect x="40" y="40" width="20" height="20"/>
        </g>
      </g>
    </g>
    
    <!-- Floating Elements -->
    <g transform="translate(180, 100)">
      <!-- Document Icon -->
      <rect x="0" y="0" width="60" height="80" rx="4" fill="#ffffff" stroke="currentColor" stroke-width="2"/>
      <path d="M10 20h40M10 35h30M10 50h35" stroke="currentColor" stroke-width="2" opacity="0.3"/>
    </g>
    
    <g transform="translate(560, 200)">
      <!-- Phone/Scanner -->
      <rect x="0" y="0" width="70" height="120" rx="8" fill="#ffffff" stroke="currentColor" stroke-width="2"/>
      <rect x="5" y="5" width="60" height="110" rx="4" fill="currentColor" opacity="0.1"/>
      <circle cx="35" cy="100" r="8" fill="#ffffff" stroke="currentColor" stroke-width="2"/>
    </g>
    
    <!-- Connection Lines -->
    <g stroke="currentColor" stroke-width="2" stroke-dasharray="4 4" opacity="0.5">
      <path d="M240 140C280 140,320 180,400 180"/>
      <path d="M560 260C520 260,480 220,400 220"/>
    </g>
    
    <!-- Decorative Circles -->
    <g fill="currentColor" opacity="0.1">
      <circle cx="150" cy="450" r="40"/>
      <circle cx="650" cy="150" r="30"/>
      <circle cx="700" cy="400" r="25"/>
    </g>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  className: {
    type: String,
    default: 'w-full h-full'
  }
})
</script>