<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

const categories = ref(['All'])
const activeCategory = ref('All')
const searchQuery = ref('')
const isLoading = ref(true)
const products = ref([])

const fetchProducts = async () => {
  isLoading.value = true
  try {
    const { data: prodData, error: prodErr } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_available', true)
      .order('id', { ascending: false })
      
    if (prodErr) throw prodErr
    if (prodData) {
      products.value = prodData.map(p => ({
        ...p,
        category: p.categories?.name || 'Unknown'
      }))
      
      const uniqueCats = [...new Set(products.value.map(p => p.category))]
      categories.value = ['All', ...uniqueCats]
    }
  } catch (err) {
    console.error('Failed to fetch products:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})

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
            <img v-if="product.image_url" :src="product.image_url" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div v-else class="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">Tanpa Foto</div>
            

          </div>
          
          <!-- Content Section -->
          <div class="p-6 flex flex-col flex-grow">
            <!-- Header: Title and Price -->
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-lg font-serif text-[#4A2525] leading-tight pr-4 font-semibold">{{ product.name }}</h3>
              <div class="text-right flex-shrink-0">
                <p v-if="product.original_price" class="text-xs text-stone-400 line-through mb-0.5">{{ formatPrice(product.original_price) }}</p>
                <div v-else class="h-4 mb-0.5"></div>
                <p class="text-[15px] font-bold text-[#C57474]">{{ formatPrice(product.price) }}</p>
              </div>
            </div>
            
            <!-- Description -->
            <p class="text-sm text-stone-500 mb-6 leading-relaxed line-clamp-2">{{ product.description || 'Stunning handcrafted bouquet suitable for beautiful moments.' }}</p>
            
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
