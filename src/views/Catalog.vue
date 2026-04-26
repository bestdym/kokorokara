<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

const categories = ref(['All'])
const activeCategory = ref('All')
const searchQuery = ref('')
const isLoading = ref(true)
const products = ref([])
const selectedProduct = ref(null)

const openProductDetail = (product) => {
  selectedProduct.value = product
}

const closeProductDetail = () => {
  selectedProduct.value = null
}

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
          <div class="relative aspect-square overflow-hidden bg-stone-100 group cursor-pointer" @click="openProductDetail(product)">
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
            <div class="mt-auto flex items-center justify-center gap-3">
              <!-- Detail button -->
              <button @click="openProductDetail(product)" class="group flex items-center justify-center h-[44px] w-[44px] hover:w-[130px] bg-white border border-rose-200 text-[#B88B8B] hover:bg-rose-50 rounded-full transition-all duration-300 overflow-hidden shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span class="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 overflow-hidden transition-all duration-300 font-semibold text-sm whitespace-nowrap">
                  See Details
                </span>
              </button>

              <!-- Order Now button -->
              <button class="group flex items-center justify-center h-[44px] w-[44px] hover:w-[130px] bg-[#B88B8B] hover:bg-[#9D6C6C] text-white rounded-full transition-all duration-300 overflow-hidden shadow-sm shadow-[#B88B8B]/30">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span class="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 overflow-hidden transition-all duration-300 font-semibold text-sm whitespace-nowrap">
                  Order Now
                </span>
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

    <!-- Product Detail Modal Overlay -->
    <div v-if="selectedProduct" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-rose-100 relative">
        
        <!-- Close Button (Absolute against modal) -->
        <button @click="closeProductDetail" class="absolute top-4 right-4 z-10 text-stone-400 hover:text-[#4A2525] bg-white/50 hover:bg-white backdrop-blur-sm shadow-sm p-2 rounded-full transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <!-- Left: Image -->
        <div class="w-full md:w-1/2 h-64 md:h-auto bg-stone-100 relative shrink-0">
          <img v-if="selectedProduct.image_url" :src="selectedProduct.image_url" :alt="selectedProduct.name" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-stone-400">Tanpa Foto</div>
          <!-- PO Tag inside image -->
          <span v-if="selectedProduct.is_preorder" class="absolute top-4 left-4 px-3 py-1 bg-yellow-100/90 backdrop-blur text-yellow-800 rounded-lg text-xs font-bold border border-yellow-200/50 shadow-sm">
            Tersedia Pre-Order ({{ selectedProduct.estimated_days }} Hari)
          </span>
        </div>

        <!-- Right: Information -->
        <div class="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto">
          <div class="mb-6">
            <span class="px-3 py-1 bg-rose-50 border border-rose-100 text-rose-800 rounded-lg text-xs font-bold mb-4 inline-block tracking-wide uppercase">{{ selectedProduct.category }}</span>
            <h2 class="text-3xl font-serif text-[#4A2525] leading-tight font-semibold mb-2">{{ selectedProduct.name }}</h2>
            
            <div class="flex items-center gap-3">
              <p class="text-2xl font-bold text-[#C57474]">{{ formatPrice(selectedProduct.price) }}</p>
              <p v-if="selectedProduct.original_price" class="text-sm text-stone-400 line-through">{{ formatPrice(selectedProduct.original_price) }}</p>
            </div>
          </div>

          <div class="mb-8 flex-1">
            <h4 class="text-sm font-bold text-stone-700 mb-2">Deskripsi Produk</h4>
            <p class="text-stone-500 leading-relaxed text-sm whitespace-pre-line">{{ selectedProduct.description || 'Tidak ada deskripsi rinci untuk produk ini.' }}</p>
          </div>

          <!-- Checkout Button -->
          <div class="mt-auto pt-6 border-t border-rose-50 flex gap-4">
             <button class="flex-1 bg-[#8B3A3A] hover:bg-[#682a2a] text-white py-4 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Pesan Sekarang
             </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
