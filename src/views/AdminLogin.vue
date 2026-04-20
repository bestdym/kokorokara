<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error
    
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'Gagal login. Periksa email dan password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-stone-50 pt-32 pb-20">
    <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-[2rem] shadow-lg border border-rose-100 p-10 mt-10">
        <div class="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#8B3A3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h1 class="text-3xl font-serif text-center text-[#4A2525] mb-2">Login Admin</h1>
        <p class="text-stone-500 mb-8 text-center text-sm">Masuk untuk mengelola katalog, kategori, dan pengaturan Kokorokara.</p>
        
        <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm border border-red-100 text-center">
          {{ errorMessage }}
        </div>

        <form class="space-y-5" @submit.prevent="handleLogin">
          <div>
            <label class="block text-sm font-bold text-stone-700 mb-1">Email Admin</label>
            <input v-model="email" type="email" required placeholder="admin@kokorokara.com" class="w-full px-4 py-3 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] transition-shadow" />
          </div>
          <div>
            <label class="block text-sm font-bold text-stone-700 mb-1">Password</label>
            <input v-model="password" type="password" required placeholder="••••••••" class="w-full px-4 py-3 bg-[#FFFBF8] rounded-xl border border-rose-100 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] transition-shadow" />
          </div>
          
          <button type="submit" :disabled="loading" class="w-full bg-[#8B3A3A] hover:bg-[#682a2a] disabled:bg-stone-400 text-white py-3 rounded-xl font-bold transition-all mt-4">
            {{ loading ? 'Memproses...' : 'Masuk Dashboard' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
