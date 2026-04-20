<script setup>
import { ref } from 'vue'

const categories = ['Semua', 'Bunga Segar', 'Mawar', 'Bunga Semu', 'Premium']
const activeCategory = ref('Semua')

const products = ref([
  { id: 1, name: 'Cinta Merona', price: 450000, category: 'Mawar', image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?w=800&auto=format&fit=crop' },
  { id: 2, name: 'Taman Mentari', price: 350000, category: 'Bunga Segar', image: 'https://images.unsplash.com/photo-1508611440879-166fa2772590?w=800&auto=format&fit=crop' },
  { id: 3, name: 'Putih Keanggunan', price: 550000, category: 'Premium', image: 'https://images.unsplash.com/photo-1457089328109-e5d9f05f0e90?w=800&auto=format&fit=crop' },
  { id: 4, name: 'Mimpi Pastel', price: 400000, category: 'Bunga Segar', image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop' },
  { id: 5, name: 'Cantik Abadi', price: 300000, category: 'Bunga Semu', image: 'https://images.unsplash.com/photo-1507311416545-92fee1c585c2?w=800&auto=format&fit=crop' },
  { id: 6, name: 'Romansa Dalam', price: 600000, category: 'Mawar', image: 'https://images.unsplash.com/photo-1548625361-b54c8ee8618e?w=800&auto=format&fit=crop' },
])

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}
</script>

<template>
  <div class="min-h-screen bg-white pt-32 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Page Header -->
      <div class="text-center py-12">
        <h1 class="text-4xl md:text-5xl font-serif text-[#4A2525] mb-4">Koleksi Kami</h1>
        <p class="text-stone-500 max-w-2xl mx-auto">Jelajahi dan temukan pilihan buket cantik yang dikurasi dengan sepenuh hati.</p>
      </div>

      <!-- Categories -->
      <div class="flex flex-wrap justify-center gap-4 mb-12">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = cat"
          :class="['px-6 py-2 rounded-full text-sm font-bold transition-all duration-300', 
            activeCategory === cat ? 'bg-[#8B3A3A] text-white shadow-lg shadow-[#8B3A3A]/30' : 'bg-[#FFFBF8] text-stone-600 border border-rose-100 hover:bg-rose-50 hover:text-rose-600']"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Product Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="product in products" :key="product.id" class="group relative cursor-pointer">
          <div class="relative bg-stone-100 rounded-3xl overflow-hidden aspect-[4/5] mb-4 border border-rose-50 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            
            <!-- Quick Add Button -->
            <div class="absolute bottom-4 left-0 right-0 px-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
              <button class="w-full bg-white/95 backdrop-blur-sm text-[#8B3A3A] py-3 rounded-2xl font-bold hover:bg-[#8B3A3A] hover:text-white transition-colors shadow-lg border border-[#8B3A3A]/10">
                Masukkan Keranjang
              </button>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          
          <div class="flex justify-between items-start px-2">
            <div>
              <h3 class="text-xl font-serif text-[#4A2525] group-hover:text-rose-600 transition-colors">{{ product.name }}</h3>
              <p class="text-sm text-rose-400 font-medium tracking-wide mt-1">{{ product.category }}</p>
            </div>
            <p class="text-lg font-bold text-[#8B3A3A] bg-rose-50 px-3 py-1 rounded-full">{{ formatPrice(product.price) }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
