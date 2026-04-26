<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const router = useRouter()
const activeTab = ref('products')
const isLoading = ref(true)

// Data State
const products = ref([])
const categories = ref([])
const settings = ref({ whatsapp_number: '', is_maintenance: false })

// Form State
const productForm = ref({
  name: '',
  description: '',
  price: 0,
  original_price: null,
  image_url: '',
  category_id: null,
  is_preorder: false,
  estimated_days: 0,
  is_available: true,
  is_home: false,
  flowers: '',
})
const isEditingProduct = ref(false)
const showProductModal = ref(false)
const isUploading = ref(false)

const categoryForm = ref({ name: '', slug: '', description: '', is_home: false })
const isEditingCategory = ref(false)
const showCategoryModal = ref(false)

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `product_images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('products').getPublicUrl(filePath)
    productForm.value.image_url = data.publicUrl
  } catch (err) {
    alert('Gagal mengupload gambar: ' + err.message)
  } finally {
    isUploading.value = false
  }
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/admin')
}

// Fetch Data
const fetchData = async () => {
  isLoading.value = true
  try {
    const [prodRes, catRes, setRes] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('id', { ascending: false }),
      supabase.from('categories').select('*'),
      supabase.from('settings').select('*').limit(1).single(),
    ])

    if (prodRes.data) products.value = prodRes.data
    if (catRes.data) categories.value = catRes.data
    if (setRes.data) settings.value = setRes.data
  } catch (err) {
    console.error('Error fetching data:', err)
  } finally {
    isLoading.value = false
  }
}

// Settings
const saveSettings = async () => {
  try {
    const { error } = await supabase.from('settings').upsert({ id: 1, ...settings.value })
    if (error) throw error
    alert('Pengaturan berhasil disimpan!')
  } catch (err) {
    alert('Gagal menyimpan pengaturan: ' + err.message)
  }
}

// Products
const openAddProduct = () => {
  productForm.value = {
    name: '',
    description: '',
    price: 0,
    original_price: null,
    image_url: '',
    category_id: categories.value[0]?.id || null,
    is_preorder: false,
    estimated_days: 0,
    is_available: true,
    is_home: false,
    flowers: '',
  }
  isEditingProduct.value = false
  showProductModal.value = true
}

const isSelectedCategoryHome = computed(() => {
  const cat = categories.value.find(c => c.id === productForm.value.category_id)
  return cat ? cat.is_home : false
})

watch(() => productForm.value.category_id, (newVal) => {
  const cat = categories.value.find(c => c.id === newVal)
  if (cat && !cat.is_home) {
    productForm.value.is_home = false
  }
})

const openEditProduct = (prod) => {
  productForm.value = { ...prod }
  isEditingProduct.value = true
  showProductModal.value = true
}

const saveProduct = async () => {
  try {
    const category = categories.value.find(c => c.id === productForm.value.category_id)
    if (productForm.value.is_home && (!category || !category.is_home)) {
      alert('Validasi Gagal: Produk tidak bisa diset "Tampilkan di Beranda" karena Kategori yang dipilih tidak ditampilkan di Beranda.')
      productForm.value.is_home = false
      return
    }

    const payload = { ...productForm.value }
    delete payload.categories // Remove joined data before saving

    if (isEditingProduct.value) {
      const { error } = await supabase.from('products').update(payload).eq('id', payload.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('products').insert([payload])
      if (error) throw error
    }
    showProductModal.value = false
    await fetchData()
  } catch (err) {
    alert('Gagal menyimpan produk: ' + err.message)
  }
}

const deleteProduct = async (id) => {
  if (!confirm('Yakin ingin menghapus produk ini?')) return
  try {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    await fetchData()
  } catch (err) {
    alert('Gagal menghapus produk: ' + err.message)
  }
}

// Categories
const openAddCategory = () => {
  categoryForm.value = { name: '', slug: '', description: '', is_home: false }
  isEditingCategory.value = false
  showCategoryModal.value = true
}

const openEditCategory = (cat) => {
  categoryForm.value = { ...cat }
  isEditingCategory.value = true
  showCategoryModal.value = true
}

const saveCategory = async () => {
  try {
    if (isEditingCategory.value) {
      const { error } = await supabase
        .from('categories')
        .update(categoryForm.value)
        .eq('id', categoryForm.value.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('categories').insert([categoryForm.value])
      if (error) throw error
    }
    showCategoryModal.value = false
    await fetchData()
  } catch (err) {
    alert('Gagal menyimpan kategori: ' + err.message)
  }
}

const deleteCategory = async (id) => {
  if (!confirm('Yakin ingin menghapus kategori ini? (Pastikan tidak ada produk yang memakainya)'))
    return
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    await fetchData()
  } catch (err) {
    alert('Gagal menghapus kategori: ' + err.message)
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="h-screen bg-stone-50 flex overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#2A1515] flex flex-col shadow-xl z-20 shrink-0">
      <div class="p-6 border-b border-[#4A2525]">
        <div class="font-serif text-2xl font-bold tracking-wider text-white">KOKOROKARA</div>
        <div class="text-[#D7BABA] text-xs font-bold uppercase tracking-widest mt-1">
          Sistem Admin
        </div>
      </div>

      <div class="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <button
          @click="activeTab = 'categories'"
          :class="[
            'w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all text-sm',
            activeTab === 'categories'
              ? 'bg-[#8B3A3A] text-white shadow-md'
              : 'text-[#D7BABA] hover:bg-[#4A2525] hover:text-white',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-3 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          Menu Kategori
        </button>

        <button
          @click="activeTab = 'products'"
          :class="[
            'w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all text-sm',
            activeTab === 'products'
              ? 'bg-[#8B3A3A] text-white shadow-md'
              : 'text-[#D7BABA] hover:bg-[#4A2525] hover:text-white',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-3 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Katalog Produk
        </button>

        <button
          @click="activeTab = 'settings'"
          :class="[
            'w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all text-sm',
            activeTab === 'settings'
              ? 'bg-[#8B3A3A] text-white shadow-md'
              : 'text-[#D7BABA] hover:bg-[#4A2525] hover:text-white',
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-3 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Seting & WhatsApp
        </button>
      </div>

      <div class="p-4 border-t border-[#4A2525]">
        <button
          @click="handleLogout"
          class="w-full flex justify-center items-center px-4 py-3 rounded-xl border border-[#4A2525] font-bold text-[#D7BABA] hover:bg-[#4A2525] hover:text-white transition"
        >
          Keluar / Logout
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col overflow-hidden bg-[#FFFBF8]">
      <!-- Topbar Header -->
      <header
        class="bg-white border-b border-rose-100 flex items-center justify-between px-8 py-5 shrink-0 z-10"
      >
        <div>
          <h1 class="text-2xl font-serif text-[#4A2525]">
            <span v-if="activeTab === 'products'">Katalog Produk</span>
            <span v-else-if="activeTab === 'categories'">Manajemen Kategori</span>
            <span v-else>Pengaturan Sistem</span>
          </h1>
          <p class="text-stone-500 text-sm mt-0.5">Pantau dan kelola data utama website.</p>
        </div>
        <div v-if="activeTab === 'products'">
          <button
            @click="openAddProduct"
            class="bg-[#8B3A3A] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#682a2a] transition shadow-md flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Produk
          </button>
        </div>
        <div v-if="activeTab === 'categories'">
          <button
            @click="openAddCategory"
            class="bg-[#8B3A3A] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#682a2a] transition shadow-md flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Tambah Kategori
          </button>
        </div>
      </header>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto p-8">
        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="flex flex-col items-center justify-center h-full text-stone-500"
        >
          <svg
            class="animate-spin h-8 w-8 text-[#8B3A3A] mb-4"
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
          Memuat data...
        </div>

        <div v-else class="max-w-6xl w-full mx-auto pb-20">
          <!-- Tab: Products -->
          <div v-if="activeTab === 'products'">
            <div class="bg-white rounded-2xl shadow-sm border border-rose-50 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr class="bg-rose-50 border-b border-rose-100 text-sm text-[#8B3A3A]">
                      <th class="p-5 font-bold">Informasi Produk</th>
                      <th class="p-5 font-bold">Kategori</th>
                      <th class="p-5 font-bold">Harga</th>
                      <th class="p-5 font-bold">Status/Kondisi</th>
                      <th class="p-5 font-bold text-right">Opsi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="prod in products"
                      :key="prod.id"
                      class="border-b border-rose-50 hover:bg-rose-50/50 transition-colors"
                    >
                      <td class="p-5 flex items-center space-x-4">
                        <img
                          v-if="prod.image_url"
                          :src="prod.image_url"
                          class="w-14 h-14 rounded-xl object-cover bg-stone-100 shadow-sm border border-rose-100"
                        />
                        <div
                          v-else
                          class="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center text-xs text-stone-400 border border-rose-100"
                        >
                          Tanpa Foto
                        </div>
                        <div>
                          <p
                            class="font-bold text-[#4A2525] whitespace-normal line-clamp-1 max-w-[200px]"
                          >
                            {{ prod.name }}
                          </p>
                          <p
                            class="text-xs text-stone-500 whitespace-normal line-clamp-1 max-w-[200px] mt-0.5"
                          >
                            {{ prod.description }}
                          </p>
                          <p v-if="prod.flowers" class="text-[10px] text-rose-500 font-bold uppercase mt-1 tracking-wider inline-block">
                            🌸 {{ prod.flowers }}
                          </p>
                        </div>
                      </td>
                      <td class="p-5">
                        <span
                          class="px-3 py-1 bg-rose-50 border border-rose-100 text-rose-800 rounded-lg text-xs font-bold"
                          >{{ prod.categories?.name || '-' }}</span
                        >
                      </td>
                      <td class="p-5">
                        <div
                          v-if="prod.original_price"
                          class="text-xs text-stone-400 line-through mb-0.5"
                        >
                          {{ formatPrice(prod.original_price) }}
                        </div>
                        <div class="text-sm font-bold text-[#8B3A3A]">
                          {{ formatPrice(prod.price) }}
                        </div>
                      </td>
                      <td class="p-5">
                        <div class="flex items-center space-x-2">
                          <span
                            v-if="prod.is_available"
                            class="px-2.5 py-1 bg-[#E8F8EE] text-[#137A3E] rounded-md text-[11px] uppercase tracking-wider font-bold"
                            >Tersedia</span
                          >
                          <span
                            v-else
                            class="px-2.5 py-1 bg-red-50 border-red-100 text-red-600 rounded-md text-[11px] uppercase tracking-wider font-bold"
                            >Kosong</span
                          >

                          <span
                            v-if="prod.is_preorder"
                            class="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-[11px] uppercase tracking-wider font-bold"
                          >
                            PO <span class="text-blue-800">{{ prod.estimated_days }} hr</span>
                          </span>

                          <span
                            v-if="prod.is_home"
                            class="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-md text-[11px] uppercase tracking-wider font-bold mt-1 inline-block"
                          >
                            Home
                          </span>
                        </div>
                      </td>
                      <td class="p-5 text-right space-x-4">
                        <button
                          @click="openEditProduct(prod)"
                          class="text-stone-400 hover:text-[#8B3A3A] transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          @click="deleteProduct(prod.id)"
                          class="text-stone-400 hover:text-red-500 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="products.length === 0">
                      <td colspan="5" class="p-10 text-center">
                        <div
                          class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-300 mb-4"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                        </div>
                        <p class="text-stone-500 font-medium">
                          Belum ada produk apa pun di katalog.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Tab: Categories -->
          <div v-if="activeTab === 'categories'">
            <div class="bg-white rounded-2xl shadow-sm border border-rose-50 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr class="bg-rose-50 border-b border-rose-100 text-sm text-[#8B3A3A]">
                      <th class="p-5 font-bold w-16">ID</th>
                      <th class="p-5 font-bold">Nama Kategori</th>
                      <th class="p-5 font-bold min-w-[200px]">Deskripsi</th>
                      <th class="p-5 font-bold">Slug (URL)</th>
                      <th class="p-5 font-bold">Status</th>
                      <th class="p-5 font-bold text-right">Opsi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="cat in categories"
                      :key="cat.id"
                      class="border-b border-rose-50 hover:bg-rose-50/50 transition-colors"
                    >
                      <td class="p-5 text-sm font-bold text-stone-400">#{{ cat.id }}</td>
                      <td class="p-5">
                        <p class="text-sm font-bold text-[#4A2525]">{{ cat.name }}</p>
                      </td>
                      <td class="p-5">
                        <p class="text-xs text-stone-500 whitespace-normal line-clamp-2">{{ cat.description || '-' }}</p>
                      </td>
                      <td class="p-5">
                        <span class="px-3 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs">{{
                          cat.slug
                        }}</span>
                      </td>
                      <td class="p-5">
                        <span v-if="cat.is_home" class="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-md text-[11px] uppercase tracking-wider font-bold">Beranda</span>
                        <span v-else class="text-xs text-stone-400">-</span>
                      </td>
                      <td class="p-5 text-right space-x-4">
                        <button
                          @click="openEditCategory(cat)"
                          class="text-stone-400 hover:text-[#8B3A3A] transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          @click="deleteCategory(cat.id)"
                          class="text-stone-400 hover:text-red-500 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 inline"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="categories.length === 0">
                      <td colspan="6" class="p-10 text-center">
                        <p class="text-stone-500 font-medium">Belum ada data kategori.</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- Tab: Settings -->
          <div v-if="activeTab === 'settings'" class="max-w-3xl">
            <div class="bg-white rounded-2xl shadow-sm border border-rose-50 p-8">
              <form @submit.prevent="saveSettings" class="space-y-8">
                <div class="pb-6 border-b border-rose-50">
                  <h3 class="text-xl font-serif text-[#4A2525] mb-4">
                    Pengaturan Checkout WhatsApp
                  </h3>
                  <div class="bg-[#FFFBF8] p-5 rounded-xl border border-rose-100 flex items-start">
                    <div class="shrink-0 pt-0.5 mr-4 text-[#25D366]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-7 w-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
                        />
                      </svg>
                    </div>
                    <div>
                      <label class="block text-sm font-bold text-stone-700 mb-1"
                        >Nomor WhatsApp Tujuan</label
                      >
                      <p class="text-xs text-stone-500 mb-3 leading-relaxed">
                        Saat pelanggan klik "Checkout via WhatsApp" di keranjang, format pesan akan
                        dikirim otomatis ke nomor ini. Selalu gunakan awalan angka
                        <strong class="text-stone-700">62</strong> sebagai kode area Indonesia.
                      </p>
                      <input
                        v-model="settings.whatsapp_number"
                        type="tel"
                        placeholder="Contoh: 628123456789"
                        class="w-full max-w-sm px-4 py-3 bg-white rounded-xl border border-rose-200 focus:outline-none focus:border-[#8B3A3A] focus:ring-1 focus:ring-[#8B3A3A]"
                      />
                    </div>
                  </div>
                </div>

                <div class="pb-6">
                  <h3 class="text-xl font-serif text-[#4A2525] mb-4">Pengaturan Sistem</h3>
                  <div
                    class="flex items-center space-x-4 bg-rose-50 p-5 rounded-xl border border-rose-100"
                  >
                    <div
                      class="shrink-0 flex items-center justify-center p-2 bg-yellow-100 text-yellow-600 rounded-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <label
                        for="maintenance"
                        class="block text-sm font-bold text-stone-700 mb-0.5 cursor-pointer"
                        >Mode Perawatan (Under Maintenance)</label
                      >
                      <p class="text-xs text-stone-500">
                        Aktifkan ini jika Anda sedang membuat perubahan besar pada situs atau
                        menutup toko sementara sehingga toko online tidak bisa menerima pembeli
                        baru.
                      </p>
                    </div>
                    <div class="shrink-0">
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          v-model="settings.is_maintenance"
                          type="checkbox"
                          id="maintenance"
                          class="sr-only peer"
                        />
                        <div
                          class="w-11 h-6 bg-rose-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-rose-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B3A3A]"
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="flex justify-end pt-4 border-t border-rose-50">
                  <button
                    type="submit"
                    class="bg-[#8B3A3A] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#682a2a] transition shadow-lg shadow-[#8B3A3A]/20"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Product Modal Overlay (Unchanged functionally, minor style tweaks) -->
    <div
      v-if="showProductModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-rose-100"
      >
        <div class="flex justify-between items-center p-6 border-b border-rose-50 bg-[#FFFBF8]">
          <h2 class="text-2xl font-serif text-[#4A2525]">
            {{ isEditingProduct ? 'Sunting Data Produk' : 'Buat Produk Baru' }}
          </h2>
          <button
            @click="showProductModal = false"
            class="text-stone-400 hover:text-red-500 transition-colors p-2 bg-white rounded-full border border-rose-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="flex-1 overflow-y-auto p-8 bg-white">
          <div class="grid grid-cols-2 gap-5">
            <div class="col-span-2">
              <label class="block text-sm font-bold text-stone-700 mb-1">Nama Produk Bunga</label>
              <input
                v-model="productForm.name"
                required
                placeholder="Contoh: Buket Mawar Cantik"
                class="w-full px-4 py-3 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
              />
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-bold text-stone-700 mb-1">Deskripsi Singkat</label>
              <textarea
                v-model="productForm.description"
                rows="3"
                placeholder="Jelaskan detail singkat tentang produk ini..."
                class="w-full px-4 py-3 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
              ></textarea>
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-bold text-stone-700 mb-1">Jenis Bunga</label>
              <input
                v-model="productForm.flowers"
                placeholder="Contoh: Mawar Merah, Tulip (pisahkan dengan koma)"
                class="w-full px-4 py-3 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-stone-700 mb-1">Harga (Rupiah)</label>
              <div class="relative">
                <span class="absolute left-4 top-3.5 text-stone-500 font-bold">Rp</span>
                <input
                  v-model.number="productForm.price"
                  type="number"
                  required
                  class="w-full pl-12 pr-4 py-3 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-stone-700 mb-1"
                >Harga Coret (Opsional)</label
              >
              <div class="relative">
                <span class="absolute left-4 top-3.5 text-stone-500 font-bold">Rp</span>
                <input
                  v-model.number="productForm.original_price"
                  type="number"
                  placeholder="Kosongkan jika tidak ada diskon"
                  class="w-full pl-12 pr-4 py-3 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-stone-700 mb-1">Kategori Induk</label>
              <select
                v-model="productForm.category_id"
                required
                class="w-full px-4 py-3 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="col-span-2">
              <label class="block text-sm font-bold text-stone-700 mb-1">Foto Produk</label>
              <div class="flex items-center gap-4">
                <img
                  v-if="productForm.image_url"
                  :src="productForm.image_url"
                  class="w-16 h-16 rounded-xl object-cover border border-rose-100"
                />
                <div class="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleFileUpload"
                    class="w-full px-4 py-2 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-[#8B3A3A] hover:file:bg-rose-100"
                  />
                  <p v-if="isUploading" class="text-xs text-[#8B3A3A] mt-2 font-bold animate-pulse">
                    Sedang mengupload gambar...
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Switches / Bools -->
          <div class="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 space-y-5 mt-6">
            <h4
              class="text-sm font-bold text-[#8B3A3A] uppercase tracking-widest border-b border-rose-100 pb-2"
            >
              Status Penjualan
            </h4>

            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                v-model="productForm.is_available"
                type="checkbox"
                class="w-5 h-5 rounded border-rose-300 text-[#8B3A3A] focus:ring-[#8B3A3A]"
              />
              <div class="flex-1">
                <span class="block text-sm font-bold text-stone-700">Tersedia untuk dijual</span>
                <span class="block text-xs text-stone-500"
                  >Mencentang ini berarti pembeli bisa menambahkan produk ke keranjang.</span
                >
              </div>
            </label>

            <label class="flex items-center space-x-3 cursor-pointer pt-4 border-t border-rose-100" :class="{ 'opacity-60': !isSelectedCategoryHome }">
              <input
                v-model="productForm.is_home"
                type="checkbox"
                :disabled="!isSelectedCategoryHome"
                class="w-5 h-5 rounded border-rose-300 text-[#8B3A3A] focus:ring-[#8B3A3A] disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div class="flex-1">
                <span class="block text-sm font-bold" :class="isSelectedCategoryHome ? 'text-stone-700' : 'text-stone-400'">Tampilkan di Beranda (Home)</span>
                <span v-if="isSelectedCategoryHome" class="block text-xs text-stone-500"
                  >Jika dicentang, produk ini berpotensi tampil di halaman depan (Home) pada kategorinya.</span
                >
                <span v-else class="block text-xs text-red-500 mt-1 font-semibold"
                  >Peringatan: Kategori yang Anda pilih saat ini tidak ditampilkan di Beranda. Centang Beranda pada kategori terlebih dahulu.</span
                >
              </div>
            </label>

            <div class="pt-4 border-t border-rose-100">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  v-model="productForm.is_preorder"
                  type="checkbox"
                  class="w-5 h-5 rounded border-rose-300 text-[#8B3A3A] focus:ring-[#8B3A3A]"
                />
                <div class="flex-1">
                  <span class="block text-sm font-bold text-stone-700"
                    >Aktifkan Pre-Order (PO)</span
                  >
                  <span class="block text-xs text-stone-500"
                    >Gunakan sistem ini jika buket membutuhkan waktu pengerjaan berhari-hari.</span
                  >
                </div>
              </label>

              <div
                v-if="productForm.is_preorder"
                class="mt-4 ml-8 flex items-center bg-white p-3 rounded-lg border border-rose-100 inline-flex"
              >
                <label class="text-sm font-bold text-stone-700 mr-3">Estimasi Pengerjaan:</label>
                <div class="flex items-center">
                  <input
                    v-model.number="productForm.estimated_days"
                    type="number"
                    min="1"
                    class="w-16 px-2 py-1.5 border border-rose-200 rounded-lg text-center focus:ring-1 focus:ring-[#8B3A3A]"
                  />
                  <span class="text-sm text-stone-500 ml-2">Hari</span>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div class="p-6 border-t border-rose-100 flex space-x-4 shrink-0 bg-[#FFFBF8]">
          <button
            type="button"
            @click="showProductModal = false"
            class="flex-1 py-3.5 bg-white border border-rose-100 text-stone-500 rounded-xl font-bold hover:bg-stone-50 transition"
          >
            Tutup
          </button>
          <button
            type="button"
            @click="saveProduct"
            :disabled="isUploading"
            class="flex-1 py-3.5 bg-[#8B3A3A] text-white rounded-xl font-bold hover:bg-[#682a2a] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#8B3A3A]/20 transition"
          >
            {{ isEditingProduct ? 'Update Produk' : 'Simpan Produk Baru' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Category Modal Overlay -->
    <div
      v-if="showCategoryModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-[2rem] w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-rose-100"
      >
        <div class="flex justify-between items-center p-6 border-b border-rose-50 bg-[#FFFBF8]">
          <h2 class="text-xl font-serif text-[#4A2525]">
            {{ isEditingCategory ? 'Sunting Kategori' : 'Tambah Kategori' }}
          </h2>
          <button
            @click="showCategoryModal = false"
            class="text-stone-400 hover:text-red-500 transition-colors p-2 bg-white rounded-full border border-rose-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveCategory" class="flex-1 overflow-y-auto p-6 bg-white space-y-4">
          <div>
            <label class="block text-sm font-bold text-stone-700 mb-1">Nama Kategori</label>
            <input
              v-model="categoryForm.name"
              required
              placeholder="Contoh: Fresh Flowers"
              class="w-full px-4 py-3 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-stone-700 mb-1">Slug (Link URL)</label>
            <input
              v-model="categoryForm.slug"
              required
              placeholder="Contoh: fresh-flowers"
              class="w-full px-4 py-3 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
            />
            <p class="text-xs text-stone-400 mt-1">
              Harus unik, gunakan huruf kecil dan tanpa spasi (boleh pakai tanda strip).
            </p>
          </div>
          <div>
            <label class="block text-sm font-bold text-stone-700 mb-1">Deskripsi</label>
            <textarea
              v-model="categoryForm.description"
              rows="3"
              placeholder="Deskripsi kategori ini..."
              class="w-full px-4 py-3 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
            ></textarea>
          </div>
          <div class="pt-2">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                v-model="categoryForm.is_home"
                type="checkbox"
                class="w-5 h-5 rounded border-rose-300 text-[#8B3A3A] focus:ring-[#8B3A3A]"
              />
              <div class="flex-1">
                <span class="block text-sm font-bold text-stone-700">Tampilkan di Beranda (Home)</span>
                <span class="block text-xs text-stone-500"
                  >Centang jika ingin kategori beserta produknya tampil di beranda utama.</span
                >
              </div>
            </label>
          </div>
        </form>

        <div class="p-6 border-t border-rose-100 flex space-x-4 shrink-0 bg-[#FFFBF8]">
          <button
            type="button"
            @click="showCategoryModal = false"
            class="flex-1 py-3 bg-white border border-rose-100 text-stone-500 rounded-xl font-bold hover:bg-stone-50 transition"
          >
            Batal
          </button>
          <button
            type="button"
            @click="saveCategory"
            class="flex-1 py-3 bg-[#8B3A3A] text-white rounded-xl font-bold hover:bg-[#682a2a] shadow-lg shadow-[#8B3A3A]/20 transition"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
