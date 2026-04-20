<script setup>
import { ref, computed } from 'vue'

const categories = ['Semua', 'Bunga Segar', 'Mawar', 'Bunga Semu', 'Premium']
const activeCategory = ref('Semua')
const searchQuery = ref('')

const products = ref([
  { id: 1, name: 'Cinta Merona', price: 450000, category: 'Mawar', image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?w=800&auto=format&fit=crop' },
  { id: 2, name: 'Taman Mentari', price: 350000, category: 'Bunga Segar', image: 'https://images.unsplash.com/photo-1508611440879-166fa2772590?w=800&auto=format&fit=crop' },
  { id: 3, name: 'Putih Keanggunan', price: 550000, category: 'Premium', image: 'https://images.unsplash.com/photo-1457089328109-e5d9f05f0e90?w=800&auto=format&fit=crop' },
  { id: 4, name: 'Mimpi Pastel', price: 400000, category: 'Bunga Segar', image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop' },
  { id: 5, name: 'Cantik Abadi', price: 300000, category: 'Bunga Semu', image: 'https://images.unsplash.com/photo-1507311416545-92fee1c585c2?w=800&auto=format&fit=crop' },
  { id: 6, name: 'Romansa Dalam', price: 600000, category: 'Mawar', image: 'https://images.unsplash.com/photo-1548625361-b54c8ee8618e?w=800&auto=format&fit=crop' },
  { id: 7, name: 'Mentari Pagi', price: 250000, category: 'Bunga Segar', image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&auto=format&fit=crop' },
  { id: 8, name: 'Elegansi Klasik', price: 750000, category: 'Premium', image: 'https://images.unsplash.com/photo-1518717871626-d62fba237332?w=800&auto=format&fit=crop' },
])

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // Filter kategori
    const matchCategory = activeCategory.value === 'Semua' || product.category === activeCategory.value;
    
    // Filter pencarian
    const matchSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        product.category.toLowerCase().includes(searchQuery.value.toLowerCase());
                        
    return matchCategory && matchSearch;
  });
})
</script>

<template>
  <div class="min-h-screen bg-white pt-32 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Page Header -->
      <div class="text-center py-12">
        <h1 class="text-4xl md:text-5xl font-serif text-[#4A2525] mb-4">Koleksi Kami</h1>
        <p class="text-stone-500 max-w-2xl mx-auto">Jelajahi dan temukan pilihan buket cantik yang dikurasi dengan sepenuh hati.</p>
      </div>

      <!-- Categories & Search Bar -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        
        <!-- Search Bar -->
        <div class="w-full md:w-80 relative shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama buket..." 
            class="w-full pl-12 pr-4 py-3 bg-[#FFFBF8] rounded-full border border-rose-200 focus:outline-none focus:border-[#8B3A3A] focus:ring-1 focus:ring-[#8B3A3A] shadow-sm transition-all"
          >
        </div>

        <!-- Category Buttons -->
        <div class="flex flex-wrap items-center justify-end gap-3 flex-1">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="activeCategory = cat"
            :class="['px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300', 
              activeCategory === cat ? 'bg-[#8B3A3A] text-white shadow-md' : 'bg-stone-50 text-stone-600 border border-rose-100 hover:bg-rose-50 hover:text-rose-600']"
          >
            {{ cat }}
          </button>
        </div>

      </div>

      <!-- Product Grid (4 Columns) -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="product in filteredProducts" :key="product.id" class="group relative cursor-pointer flex flex-col h-full">
          <div class="relative bg-stone-100 rounded-3xl overflow-hidden aspect-[4/5] p-2 mb-4 border border-rose-50 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105" />
            
            <!-- Quick Add Button -->
            <div class="absolute bottom-4 left-0 right-0 px-6 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
              <button class="w-full bg-white/95 backdrop-blur-md text-[#8B3A3A] py-3 rounded-2xl font-bold hover:bg-[#8B3A3A] hover:text-white transition-colors shadow-lg border border-rose-100 uppercase tracking-widest text-xs">
                Tambah
              </button>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
          </div>
          
          <div class="flex flex-col justify-between items-start px-2 mt-auto">
            <div>
              <p class="text-xs text-rose-400 font-bold tracking-widest uppercase mb-1">{{ product.category }}</p>
              <h3 class="text-xl font-serif text-[#4A2525] group-hover:text-rose-600 transition-colors leading-tight mb-2">{{ product.name }}</h3>
            </div>
            <p class="text-lg font-bold text-[#8B3A3A]">{{ formatPrice(product.price) }}</p>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-rose-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h3 class="text-xl font-bold text-[#4A2525] mb-2">Buket Tidak Ditemukan</h3>
        <p class="text-stone-500">Maaf, kami tidak dapat menemukan produk yang sesuai dengan pencarian Anda.</p>
        <button @click="searchQuery = ''; activeCategory = 'Semua'" class="mt-6 font-bold text-rose-600 hover:text-rose-800 transition">
          Reset Pencarian
        </button>
      </div>

    </div>
  </div>
</template>
