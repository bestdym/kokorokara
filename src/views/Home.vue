<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '../supabase'

const homeCategories = ref([])
const homeProducts = ref([])
const isLoading = ref(true)

const fetchHomeData = async () => {
  isLoading.value = true
  try {
    const { data: catData, error: catErr } = await supabase
      .from('categories')
      .select('*')
      .eq('is_home', true)

    if (catErr) throw catErr

    const { data: prodData, error: prodErr } = await supabase
      .from('products')
      .select('*')
      .eq('is_home', true)
      .eq('is_available', true)

    if (prodErr) throw prodErr

    if (catData) homeCategories.value = catData
    if (prodData) homeProducts.value = prodData
  } catch (err) {
    console.error('Failed to fetch home data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchHomeData()
})

const formatPrice = (price) => {
  if (!price) return ''
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}
</script>

<template>
  <div class="min-h-screen bg-transparent">
    <!-- Transparent to inherit App gradient -->
    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <!-- Content Grid Layout -->
      <div
        class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-12 pt-20"
      >
        <!-- Text Content -->
        <div class="flex-1 text-center md:text-left">
          <span
            class="inline-block py-1 px-3 rounded-full bg-rose-200 text-rose-900 text-sm font-semibold tracking-wider mb-6 border border-rose-300"
          >
            PREMIUM FLORIST QUALITY
          </span>
          <h1 class="text-5xl md:text-6xl font-serif text-[#4A2525] mb-6 leading-tight">
            <!-- Maroon/Dark Brown text -->
            Let the Flowers <br />
            <span class="text-rose-600 italic text-4xl md:text-[3.5rem] mt-2 inline-block"
              >tells Story</span
            >
          </h1>
          <p
            class="text-lg md:text-xl text-stone-600 mb-10 font-light max-w-lg mx-auto md:mx-0 leading-relaxed border-l-4 border-rose-200 pl-4"
          >
            Handcrafted flower bouquets with elegant soft colors, ready to perfect your every
            special moment.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <RouterLink
              to="/catalog"
              class="bg-[#8B3A3A] hover:bg-[#682a2a] text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-[#8B3A3A]/30 w-full sm:w-auto"
            >
              Explore Collection
            </RouterLink>
            <RouterLink
              to="/about"
              class="bg-white/80 hover:bg-white backdrop-blur-sm border-2 border-rose-100 text-[#8B3A3A] px-8 py-4 rounded-full text-lg font-bold transition-all w-full sm:w-auto shadow-sm"
            >
              Our Story
            </RouterLink>
          </div>
        </div>

        <!-- Image Gallery (Kekinian Layout) -->
        <div class="flex-1 relative w-full h-[500px] hidden md:block">
          <div
            class="absolute top-10 left-0 w-64 h-80 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white rotate-[-6deg] z-10 hover:rotate-0 hover:z-30 transition-transform duration-500"
          >
            <img
              src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop"
              class="w-full h-full object-cover"
              alt="Mawar Merah Muda"
            />
          </div>
          <div
            class="absolute bottom-10 right-10 w-72 h-96 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white rotate-[4deg] z-20 hover:rotate-0 hover:z-30 transition-transform duration-500"
          >
            <img
              src="https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=800&auto=format&fit=crop"
              class="w-full h-full object-cover"
              alt="Buket Warna Pastel"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Dynamic Categories Section -->
    <section
      class="py-24 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] relative z-20"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        <div v-if="isLoading" class="text-center py-20 text-stone-500">
          <svg
            class="animate-spin h-8 w-8 text-[#8B3A3A] mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Memuat koleksi terbaik...
        </div>

        <template v-else>
          <div v-if="homeCategories.length === 0" class="text-center py-20 text-stone-500">
            Koleksi sedang diperbarui. Silakan kunjungi halaman katalog kami!
          </div>

          <div v-for="category in homeCategories" :key="category.id">
            <!-- Category Header -->
            <div class="text-center mb-16">
              <h2 class="text-4xl font-serif text-[#4A2525] mb-4">{{ category.name }}</h2>
              <p class="text-stone-500 max-w-2xl mx-auto">
                {{
                  category.description ||
                  'Temukan desain khas kami, dikurasi khusus untuk melengkapi momen spesial Anda.'
                }}
              </p>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div
                v-for="product in homeProducts.filter((p) => p.category_id === category.id)"
                :key="product.id"
                class="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group"
              >
                <div class="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer">
                  <img
                    v-if="product.image_url"
                    :src="product.image_url"
                    :alt="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400"
                  >
                    Tanpa Foto
                  </div>
                </div>

                <div class="p-6 flex flex-col flex-grow">
                  <div class="flex justify-between items-start mb-3">
                    <h3 class="text-lg font-serif text-[#4A2525] leading-tight pr-4 font-semibold">
                      {{ product.name }}
                    </h3>
                    <div class="text-right flex-shrink-0">
                      <p
                        v-if="product.original_price"
                        class="text-xs text-stone-400 line-through mb-0.5"
                      >
                        {{ formatPrice(product.original_price) }}
                      </p>
                      <div v-else class="h-4 mb-0.5"></div>
                      <p class="text-[15px] font-bold text-[#C57474]">
                        {{ formatPrice(product.price) }}
                      </p>
                    </div>
                  </div>

                  <p
                    v-if="product.flowers"
                    class="text-[11px] text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md font-bold mb-4 uppercase tracking-wide inline-block max-w-fit line-clamp-1"
                  >
                    {{ product.flowers }}
                  </p>

                  <p class="text-sm text-stone-500 mb-6 leading-relaxed line-clamp-2">
                    {{ product.description || 'Dibuat dengan bahan-bahan premium.' }}
                  </p>

                  <div class="mt-auto flex items-center justify-center gap-3 w-full">
                    <!-- Detail button -->
                    <RouterLink
                      to="/catalog"
                      class="group shrink-0 flex items-center justify-center h-[44px] w-[44px] hover:w-[170px] max-w-full bg-white border border-rose-200 text-[#B88B8B] hover:bg-rose-50 rounded-full transition-all duration-300 overflow-hidden shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span
                        class="max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-2 overflow-hidden transition-all duration-300 font-semibold text-[13px] whitespace-nowrap"
                      >
                        See All Collection
                      </span>
                    </RouterLink>

                    <!-- Order Now button -->
                    <RouterLink
                      to="/catalog"
                      class="group shrink-0 flex items-center justify-center h-[44px] w-[44px] hover:w-[130px] max-w-full bg-[#B88B8B] hover:bg-[#9D6C6C] text-white rounded-full transition-all duration-300 overflow-hidden shadow-sm shadow-[#B88B8B]/30"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span
                        class="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 overflow-hidden transition-all duration-300 font-semibold text-sm whitespace-nowrap"
                      >
                        Order Now
                      </span>
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="homeProducts.filter((p) => p.category_id === category.id).length === 0"
              class="text-center text-stone-400 py-10"
            >
              Belum ada produk unggulan di kategori ini.
            </div>

            <div class="text-center mt-12">
              <RouterLink
                to="/catalog"
                class="inline-flex items-center text-[#8B3A3A] font-bold hover:text-rose-500 transition-colors"
              >
                view all collections
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </RouterLink>
            </div>
          </div>
        </template>
      </div>
    </section>

    <!-- Delivery Areas Section -->
    <section class="py-24 bg-transparent relative z-10 border-t border-rose-100/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <!-- Left: Delivery Info -->
          <div>
            <span
              class="inline-block py-1 px-3 border border-[#C1838A] text-[#8B3A3A] text-xs font-bold uppercase tracking-wider mb-6 bg-rose-50/50 rounded-md"
              >ISLAND-WIDE DELIVERY</span
            >
            <h2 class="text-3xl md:text-4xl font-serif text-[#4A2525] mb-6">
              Same Day Delivery Across Bali
            </h2>
            <p class="text-stone-500 leading-relaxed mb-10 text-lg max-w-lg font-light">
              From the surf in Uluwatu to the rice paddies of Ubud, we've got you covered. Order
              before 3 PM and receive your blooms the same day.
            </p>
            <div class="space-y-6">
              <div class="border-l-2 border-[#C1838A] pl-4">
                <h4 class="font-bold text-[#4A2525] mb-1">Same-Day Delivery</h4>
                <p class="text-stone-500 text-sm">Order by 3 PM for same-day delivery</p>
              </div>
              <div class="border-l-2 border-[#C1838A] pl-4">
                <h4 class="font-bold text-[#4A2525] mb-1">Hand-Delivered</h4>
                <p class="text-stone-500 text-sm">Each bouquet delivered with care</p>
              </div>
              <div class="border-l-2 border-[#C1838A] pl-4">
                <h4 class="font-bold text-[#4A2525] mb-1">Freshness Guaranteed</h4>
                <p class="text-stone-500 text-sm">100% fresh flowers or money back</p>
              </div>
            </div>
          </div>
          <!-- Right: Areas -->
          <div class="flex flex-col justify-center">
            <h3 class="text-2xl font-serif text-[#4A2525] mb-8 font-bold">Delivery Areas</h3>
            <div class="mb-8">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-[#8B3A3A] mr-3 rounded-sm"></div>
                  <h4 class="font-bold text-[#4A2525]">Priority Delivery</h4>
                </div>
                <span class="text-xs font-semibold text-stone-400 uppercase tracking-widest"
                  >Same Day</span
                >
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  class="px-4 py-2 bg-[#C1838A] text-white text-sm font-semibold rounded-lg shadow-sm"
                  >Kuta</span
                >
                <span
                  class="px-4 py-2 bg-[#C1838A] text-white text-sm font-semibold rounded-lg shadow-sm"
                  >Seminyak</span
                >
                <span
                  class="px-4 py-2 bg-[#C1838A] text-white text-sm font-semibold rounded-lg shadow-sm"
                  >Canggu</span
                >
              </div>
            </div>
            <div class="mb-10">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="w-2 h-2 bg-[#8B3A3A] mr-3 rounded-sm"></div>
                  <h4 class="font-bold text-[#4A2525]">Extended Coverage</h4>
                </div>
                <span class="text-xs font-semibold text-stone-400 uppercase tracking-widest"
                  >Order by 9 AM</span
                >
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  class="px-4 py-2 border border-[#C1838A] text-[#8B3A3A] text-sm font-semibold bg-white/50 rounded-lg shadow-sm"
                  >Sanur</span
                >
                <span
                  class="px-4 py-2 border border-[#C1838A] text-[#8B3A3A] text-sm font-semibold bg-white/50 rounded-lg shadow-sm"
                  >Jimbaran</span
                >
                <span
                  class="px-4 py-2 border border-[#C1838A] text-[#8B3A3A] text-sm font-semibold bg-white/50 rounded-lg shadow-sm"
                  >Ubud</span
                >
                <span
                  class="px-4 py-2 border border-[#C1838A] text-[#8B3A3A] text-sm font-semibold bg-white/50 rounded-lg shadow-sm"
                  >Uluwatu
                </span>
              </div>
            </div>
            <div class="border-l-2 border-[#C1838A] pl-4">
              <p class="text-sm text-stone-500">
                <strong class="text-[#8B3A3A]">Pro Tip:</strong> Don't see your area? Contact us—we
                often deliver beyond our standard zones!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
