<script setup>
import { ref, onMounted } from 'vue'
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
const productForm = ref({ name: '', description: '', price: 0, image_url: '', category: '', is_preorder: false, estimated_days: 0, is_available: true })
const isEditingProduct = ref(false)
const showProductModal = ref(false)

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/admin')
}

// Fetch Data
const fetchData = async () => {
  isLoading.value = true
  try {
    const [prodRes, catRes, setRes] = await Promise.all([
      supabase.from('products').select('*').order('id', { ascending: false }),
      supabase.from('categories').select('*'),
      supabase.from('settings').select('*').limit(1).single()
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
  productForm.value = { name: '', description: '', price: 0, image_url: '', category: categories.value[0]?.name || '', is_preorder: false, estimated_days: 0, is_available: true }
  isEditingProduct.value = false
  showProductModal.value = true
}

const openEditProduct = (prod) => {
  productForm.value = { ...prod }
  isEditingProduct.value = true
  showProductModal.value = true
}

const saveProduct = async () => {
  try {
    if (isEditingProduct.value) {
      const { error } = await supabase.from('products').update(productForm.value).eq('id', productForm.value.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('products').insert([productForm.value])
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

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="min-h-screen bg-[#FFFBF8] pt-24 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-rose-100">
        <div>
          <h1 class="text-3xl font-serif text-[#4A2525]">Dashboard Admin</h1>
          <p class="text-stone-500 text-sm mt-1">Kelola toko Kokorokara Anda.</p>
        </div>
        <button @click="handleLogout" class="px-5 py-2 bg-rose-50 text-[#8B3A3A] rounded-xl font-bold hover:bg-rose-100 transition border border-rose-100">
          Logout
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex space-x-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-rose-50 inline-flex">
        <button @click="activeTab = 'products'" :class="['px-6 py-2 rounded-lg font-bold text-sm transition', activeTab === 'products' ? 'bg-[#8B3A3A] text-white' : 'text-stone-600 hover:bg-rose-50']">Produk</button>
        <button @click="activeTab = 'settings'" :class="['px-6 py-2 rounded-lg font-bold text-sm transition', activeTab === 'settings' ? 'bg-[#8B3A3A] text-white' : 'text-stone-600 hover:bg-rose-50']">Pengaturan & WhatsApp</button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20 text-stone-500">
        Memuat data...
      </div>

      <div v-else>
        <!-- Tab: Products -->
        <div v-if="activeTab === 'products'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-serif text-[#4A2525]">Katalog Produk</h2>
            <button @click="openAddProduct" class="bg-[#8B3A3A] text-white px-5 py-2 rounded-xl font-bold hover:bg-[#682a2a] transition shadow-md">
              + Tambah Produk
            </button>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-rose-50 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-rose-50 border-b border-rose-100 text-sm text-[#8B3A3A]">
                    <th class="p-4 font-bold">Produk</th>
                    <th class="p-4 font-bold">Kategori</th>
                    <th class="p-4 font-bold">Harga</th>
                    <th class="p-4 font-bold">Status</th>
                    <th class="p-4 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="prod in products" :key="prod.id" class="border-b border-rose-50 hover:bg-rose-50/50">
                    <td class="p-4 flex items-center space-x-4">
                      <img v-if="prod.image_url" :src="prod.image_url" class="w-12 h-12 rounded-lg object-cover bg-stone-100" />
                      <div v-else class="w-12 h-12 rounded-lg bg-stone-200 flex items-center justify-center text-xs text-stone-400">No Img</div>
                      <div>
                        <p class="font-bold text-[#4A2525]">{{ prod.name }}</p>
                        <p class="text-xs text-stone-500 truncate w-40">{{ prod.description }}</p>
                      </div>
                    </td>
                    <td class="p-4 text-sm text-stone-600">{{ prod.category }}</td>
                    <td class="p-4 text-sm font-bold text-[#8B3A3A]">{{ formatPrice(prod.price) }}</td>
                    <td class="p-4">
                      <span v-if="prod.is_available" class="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Tersedia</span>
                      <span v-else class="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">Kosong</span>
                      <span v-if="prod.is_preorder" class="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">PO {{ prod.estimated_days }} Hari</span>
                    </td>
                    <td class="p-4 text-right space-x-2">
                      <button @click="openEditProduct(prod)" class="text-blue-600 hover:text-blue-800 text-sm font-bold">Edit</button>
                      <button @click="deleteProduct(prod.id)" class="text-red-500 hover:text-red-700 text-sm font-bold">Hapus</button>
                    </td>
                  </tr>
                  <tr v-if="products.length === 0">
                    <td colspan="5" class="p-8 text-center text-stone-500">Belum ada produk.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Tab: Settings -->
        <div v-if="activeTab === 'settings'" class="max-w-2xl">
          <div class="bg-white rounded-2xl shadow-sm border border-rose-50 p-8">
            <h2 class="text-2xl font-serif text-[#4A2525] mb-6">Pengaturan Checkout WhatsApp</h2>
            <form @submit.prevent="saveSettings" class="space-y-6">
              <div>
                <label class="block text-sm font-bold text-stone-700 mb-2">Nomor WhatsApp Admin</label>
                <p class="text-xs text-stone-500 mb-2">Gunakan format angka dengan awalan kode negara (contoh: 628123456789)</p>
                <input v-model="settings.whatsapp_number" type="text" placeholder="628..." class="w-full px-4 py-3 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]" />
              </div>

              <div class="flex items-center space-x-3 bg-rose-50 p-4 rounded-xl border border-rose-100">
                <input v-model="settings.is_maintenance" type="checkbox" id="maintenance" class="w-5 h-5 text-[#8B3A3A] rounded border-rose-300 focus:ring-[#8B3A3A]" />
                <label for="maintenance" class="text-sm font-bold text-[#4A2525]">Mode Perawatan (Maintenance)</label>
              </div>

              <button type="submit" class="bg-[#8B3A3A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#682a2a] transition w-full">
                Simpan Pengaturan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Modal Overlay -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-rose-100">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-serif text-[#4A2525]">{{ isEditingProduct ? 'Edit Produk' : 'Tambah Produk Baru' }}</h2>
          <button @click="showProductModal = false" class="text-stone-400 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-bold text-stone-700 mb-1">Nama Produk</label>
              <input v-model="productForm.name" required class="w-full p-3 bg-[#FFFBF8] rounded-xl border border-rose-100" />
            </div>
            
            <div class="col-span-2">
              <label class="block text-sm font-bold text-stone-700 mb-1">Deskripsi Singkat</label>
              <textarea v-model="productForm.description" rows="2" class="w-full p-3 bg-[#FFFBF8] rounded-xl border border-rose-100"></textarea>
            </div>

            <div>
              <label class="block text-sm font-bold text-stone-700 mb-1">Harga (Rp)</label>
              <input v-model.number="productForm.price" type="number" required class="w-full p-3 bg-[#FFFBF8] rounded-xl border border-rose-100" />
            </div>

            <div>
              <label class="block text-sm font-bold text-stone-700 mb-1">Kategori (Pilih/Ketik)</label>
              <input v-model="productForm.category" list="cat-list" required class="w-full p-3 bg-[#FFFBF8] rounded-xl border border-rose-100" />
              <datalist id="cat-list">
                <option v-for="cat in categories" :key="cat.id" :value="cat.name"></option>
              </datalist>
            </div>
            
            <div class="col-span-2">
              <label class="block text-sm font-bold text-stone-700 mb-1">URL Gambar Valid (Link)</label>
              <input v-model="productForm.image_url" type="url" placeholder="https://..." class="w-full p-3 bg-[#FFFBF8] rounded-xl border border-rose-100" />
            </div>
          </div>

          <!-- Switches / Bools -->
          <div class="bg-rose-50 p-4 rounded-xl border border-rose-100 space-y-3 mt-4 text-sm font-bold text-stone-700">
            <div class="flex items-center space-x-3">
              <input v-model="productForm.is_available" type="checkbox" id="stock" class="w-5 h-5 rounded border-rose-300 text-[#8B3A3A]" />
              <label for="stock">Stok Tersedia</label>
            </div>
            <div class="flex items-center justify-between border-t border-rose-100 pt-3">
              <div class="flex items-center space-x-3">
                <input v-model="productForm.is_preorder" type="checkbox" id="po" class="w-5 h-5 rounded border-rose-300 text-[#8B3A3A]" />
                <label for="po">Sistem Pre-Order (PO)</label>
              </div>
              <div v-if="productForm.is_preorder" class="flex items-center space-x-2">
                <label>Estimasi Hari:</label>
                <input v-model.number="productForm.estimated_days" type="number" min="1" class="w-16 p-1 border border-rose-200 rounded text-center" />
              </div>
            </div>
          </div>

          <div class="flex space-x-4 pt-4">
            <button type="button" @click="showProductModal = false" class="flex-1 py-3 bg-stone-100 text-stone-700 rounded-xl font-bold hover:bg-stone-200">
              Batal
            </button>
            <button type="submit" class="flex-1 py-3 bg-[#8B3A3A] text-white rounded-xl font-bold hover:bg-[#682a2a] shadow-lg shadow-[#8B3A3A]/20">
              Simpan Produk
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
