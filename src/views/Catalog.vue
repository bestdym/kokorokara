<script setup>
import { ref, computed } from 'vue'

const categories = ['All', 'Fresh Flowers', 'Roses', 'Artificial Flowers', 'Premium']
const activeCategory = ref('All')
const searchQuery = ref('')

const products = ref([
  { id: 1, name: 'Blushing Love', price: 450000, category: 'Roses', image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?w=800&auto=format&fit=crop' },
  { id: 2, name: 'Sunny Garden', price: 350000, category: 'Fresh Flowers', image: 'https://images.unsplash.com/photo-1508611440879-166fa2772590?w=800&auto=format&fit=crop' },
  { id: 3, name: 'White Elegance', price: 550000, category: 'Premium', image: 'https://images.unsplash.com/photo-1457089328109-e5d9f05f0e90?w=800&auto=format&fit=crop' },
  { id: 4, name: 'Pastel Dream', price: 400000, category: 'Fresh Flowers', image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop' },
  { id: 5, name: 'Eternal Beauty', price: 300000, category: 'Artificial Flowers', image: 'https://images.unsplash.com/photo-1507311416545-92fee1c585c2?w=800&auto=format&fit=crop' },
  { id: 6, name: 'Deep Romance', price: 600000, category: 'Roses', image: 'https://images.unsplash.com/photo-1548625361-b54c8ee8618e?w=800&auto=format&fit=crop' },
  { id: 7, name: 'Morning Sun', price: 250000, category: 'Fresh Flowers', image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=800&auto=format&fit=crop' },
  { id: 8, name: 'Classic Elegance', price: 750000, category: 'Premium', image: 'https://images.unsplash.com/photo-1518717871626-d62fba237332?w=800&auto=format&fit=crop' },
])

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // Filter kategori
    const matchCategory = activeCategory.value === 'All' || product.category === activeCategory.value;
    
    // Filter pencarian
    const matchSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        product.category.toLowerCase().includes(searchQuery.value.toLowerCase());
                        
    return matchCategory && matchSearch;
  });
})
</script>

<template>
  <div class="min-h-screen bg-transparent pt-32 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Page Header -->
      <div class="text-center py-12">
        <h1 class="text-4xl md:text-5xl font-serif text-[#4A2525] mb-4">Our Collection</h1>
        <p class="text-stone-500 max-w-2xl mx-auto">Explore and discover a selection of beautiful bouquets hand-curated with all our heart.</p>
      </div>

      <!-- Categories & Search Bar -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        
        <!-- Search Bar -->
        <div class="w-full md:w-[26rem] relative shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search bouquet name..." 
            class="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-rose-200 focus:outline-none focus:border-[#8B3A3A] focus:ring-1 focus:ring-[#8B3A3A] shadow-sm transition-all"
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
        <div v-for="product in filteredProducts" :key="product.id" class="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
          <!-- Image Section -->
          <div class="relative aspect-square overflow-hidden bg-stone-100 group">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            
            <!-- Promo tag -->
            <div class="absolute top-4 left-4 bg-[#D4B572] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              PROMO
            </div>
            
            <!-- Favorite button -->
            <button class="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full text-stone-500 hover:text-rose-500 transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          
          <!-- Content Section -->
          <div class="p-6 flex flex-col flex-grow">
            <!-- Header: Title and Price -->
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-serif text-[#4A2525] leading-tight pr-4 font-semibold">{{ product.name }}</h3>
              <div class="text-right flex-shrink-0">
                <p class="text-xs text-stone-400 line-through mb-0.5">{{ formatPrice(product.price + 50000) }}</p>
                <p class="text-[15px] font-bold text-[#C57474]">{{ formatPrice(product.price) }}</p>
              </div>
            </div>
            
            <!-- Description -->
            <p class="text-sm text-stone-500 mb-6 leading-relaxed line-clamp-2">Simple and elegant hand-tied bouquet perfect for bringing warmth and joy.</p>
            
            <!-- Action Buttons -->
            <div class="mt-auto flex items-center gap-3">
              <button class="flex-1 py-2.5 px-4 border border-rose-200 text-[#B88B8B] rounded-full text-sm font-semibold hover:bg-rose-50 transition-colors">
                See Details
              </button>
              <button class="p-3 bg-[#B88B8B] hover:bg-[#9D6C6C] text-white rounded-full transition-colors flex-shrink-0 shadow-sm shadow-[#B88B8B]/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-rose-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h3 class="text-xl font-bold text-[#4A2525] mb-2">Bouquet Not Found</h3>
        <p class="text-stone-500">Sorry, we couldn't find any products matching your search.</p>
        <button @click="searchQuery = ''; activeCategory = 'All'" class="mt-6 font-bold text-rose-600 hover:text-rose-800 transition">
          Reset Search
        </button>
      </div>

    </div>
  </div>
</template>
