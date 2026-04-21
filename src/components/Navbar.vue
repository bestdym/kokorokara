<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import logoUrl from '../assets/images/kokorokara.png'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const route = useRoute()

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const isActive = (path) => route.path === path
</script>

<template>
  <div class="fixed top-0 left-0 w-full z-50 px-4 pt-4 transition-all duration-300">
    <nav 
      :class="[
        'max-w-6xl mx-auto rounded-full transition-all duration-300 border',
        isScrolled 
          ? 'bg-rose-50/80 backdrop-blur-lg shadow-lg border-rose-100/50 py-3' 
          : 'bg-white/60 backdrop-blur-md shadow-sm border-white/40 py-4'
      ]"
    >
      <div class="px-6 md:px-8">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <RouterLink to="/" class="flex-shrink-0 flex items-center gap-3">
            <img :src="logoUrl" alt="Logo Kokorokara" class="h-10 w-auto object-contain drop-shadow-sm" />
            <span class="font-serif text-2xl font-bold tracking-wider text-rose-950 hidden sm:block">
              KOKOROKARA
            </span>
          </RouterLink>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-8">
            <RouterLink to="/" :class="['text-sm font-semibold tracking-wide transition-colors', isActive('/') ? 'text-rose-600 border-b-2 border-rose-600' : 'text-stone-700 hover:text-rose-500']">Home</RouterLink>
            <RouterLink to="/catalog" :class="['text-sm font-semibold tracking-wide transition-colors', isActive('/catalog') ? 'text-rose-600 border-b-2 border-rose-600' : 'text-stone-700 hover:text-rose-500']">Catalog</RouterLink>
            <RouterLink to="/about" :class="['text-sm font-semibold tracking-wide transition-colors', isActive('/about') ? 'text-rose-600 border-b-2 border-rose-600' : 'text-stone-700 hover:text-rose-500']">About</RouterLink>
            <RouterLink to="/contact" :class="['text-sm font-semibold tracking-wide transition-colors', isActive('/contact') ? 'text-rose-600 border-b-2 border-rose-600' : 'text-stone-700 hover:text-rose-500']">Contact</RouterLink>
          </div>

          <!-- Action Buttons -->
          <div class="hidden md:flex items-center space-x-5">
            <RouterLink to="/catalog" class="bg-rose-700 hover:bg-rose-800 text-rose-50 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all shadow-md shadow-rose-900/20">
              Shop Now
            </RouterLink>
            
            <!-- Cart Icon -->
            <button class="relative p-2 text-stone-700 hover:text-rose-600 transition-colors bg-white/50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">0</span>
            </button>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-stone-800 p-2 bg-white/50 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu Dropdown -->
    <div v-show="isMobileMenuOpen" class="md:hidden mt-2 mx-auto max-w-6xl">
      <div class="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border border-rose-100 overflow-hidden px-4 py-4 space-y-2">
        <RouterLink @click="isMobileMenuOpen = false" to="/" :class="['block px-4 py-3 text-base rounded-xl', isActive('/') ? 'bg-rose-50 text-rose-700 font-bold' : 'font-medium text-stone-800 hover:bg-stone-50']">Home</RouterLink>
        <RouterLink @click="isMobileMenuOpen = false" to="/catalog" :class="['block px-4 py-3 text-base rounded-xl', isActive('/catalog') ? 'bg-rose-50 text-rose-700 font-bold' : 'font-medium text-stone-800 hover:bg-stone-50']">Catalog</RouterLink>
        <RouterLink @click="isMobileMenuOpen = false" to="/about" :class="['block px-4 py-3 text-base rounded-xl', isActive('/about') ? 'bg-rose-50 text-rose-700 font-bold' : 'font-medium text-stone-800 hover:bg-stone-50']">About</RouterLink>
        <RouterLink @click="isMobileMenuOpen = false" to="/contact" :class="['block px-4 py-3 text-base rounded-xl', isActive('/contact') ? 'bg-rose-50 text-rose-700 font-bold' : 'font-medium text-stone-800 hover:bg-stone-50']">Contact</RouterLink>
        <RouterLink @click="isMobileMenuOpen = false" to="/catalog" class="block mt-4 text-center px-4 py-3 text-base font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl transition-colors">Shop Now</RouterLink>
      </div>
    </div>
  </div>
</template>
