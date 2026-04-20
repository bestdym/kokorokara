<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-[#FFFBF8]"> <!-- Soft cream background -->
    <!-- Hero Section -->
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Abstract Decor (to make it look kekinian & soft) -->
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] bg-rose-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>
      <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-[40rem] h-[40rem] bg-amber-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-70"></div>

      <!-- Content Grid Layout -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col md:flex-row items-center gap-12 pt-20">
        
        <!-- Text Content -->
        <div class="flex-1 text-center md:text-left">
          <span class="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-800 text-sm font-semibold tracking-wider mb-6 border border-rose-200">
            KUALITAS FLORIST PREMIUM
          </span>
          <h1 class="text-5xl md:text-7xl font-serif text-[#4A2525] mb-6 leading-tight"> <!-- Maroon/Dark Brown text -->
            Biarkan Bunga <br/>
            <span class="text-rose-600 italic">Bercerita Padamu</span>
          </h1>
          <p class="text-lg md:text-xl text-stone-600 mb-10 font-light max-w-lg mx-auto md:mx-0 leading-relaxed">
            Rangkaian buket bunga buatan tangan dengan warna-warna lembut elegan, siap menyempurnakan setiap momen spesial Anda.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <RouterLink to="/catalog" class="bg-[#8B3A3A] hover:bg-[#682a2a] text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-[#8B3A3A]/30 w-full sm:w-auto">
              Jelajahi Koleksi
            </RouterLink>
            <RouterLink to="/about" class="bg-white/80 hover:bg-white backdrop-blur-sm border-2 border-rose-100 text-[#8B3A3A] px-8 py-4 rounded-full text-lg font-bold transition-all w-full sm:w-auto shadow-sm">
              Cerita Kami
            </RouterLink>
          </div>
        </div>

        <!-- Image Gallery (Kekinian Layout) -->
        <div class="flex-1 relative w-full h-[500px] hidden md:block">
          <div class="absolute top-10 left-0 w-64 h-80 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white rotate-[-6deg] z-10 hover:rotate-0 hover:z-30 transition-transform duration-500">
            <img src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover" alt="Mawar Merah Muda" />
          </div>
          <div class="absolute bottom-10 right-10 w-72 h-96 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white rotate-[4deg] z-20 hover:rotate-0 hover:z-30 transition-transform duration-500">
            <img src="https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover" alt="Buket Warna Pastel" />
          </div>
        </div>

      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-24 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] relative z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-serif text-[#4A2525] mb-4">Koleksi Bunga Pilihan</h2>
          <p class="text-stone-500 max-w-2xl mx-auto">Temukan gaya khas kami, dirancang dengan cermat untuk menyampaikan perasaan terdalam Anda dengan penuh keanggunan.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <!-- Category 1 -->
          <div class="group relative bg-[#FFFBF8] rounded-3xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-rose-50">
            <div class="relative h-80 rounded-2xl overflow-hidden mb-6">
              <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Bunga Segar" />
            </div>
            <div class="px-2 pb-4 text-center">
              <h3 class="text-2xl font-serif text-[#4A2525] mb-2">Pastel Lembut</h3>
              <p class="text-stone-500 text-sm mb-4">Pilihan bunga segar yang dipetik setiap hari dengan palet warna nan cantik.</p>
              <RouterLink to="/catalog?cat=fresh" class="inline-flex items-center text-[#8B3A3A] font-bold hover:text-rose-500 transition-colors">
                Beli Sekarang <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
              </RouterLink>
            </div>
          </div>
          
          <!-- Category 2 -->
          <div class="group relative bg-[#FFFBF8] rounded-3xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-rose-50">
            <div class="relative h-80 rounded-2xl overflow-hidden mb-6">
              <img src="https://images.unsplash.com/photo-1561181286-d3fee7d55ef6?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Koleksi Mawar" />
            </div>
            <div class="px-2 pb-4 text-center">
              <h3 class="text-2xl font-serif text-[#4A2525] mb-2">Mawar Merah Maroon</h3>
              <p class="text-stone-500 text-sm mb-4">Mawar mewah dengan pesona gelap yang melambangkan kasih sayang mendalam.</p>
              <RouterLink to="/catalog?cat=roses" class="inline-flex items-center text-[#8B3A3A] font-bold hover:text-rose-500 transition-colors">
                Beli Sekarang <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
              </RouterLink>
            </div>
          </div>

          <!-- Category 3 -->
          <div class="group relative bg-[#FFFBF8] rounded-3xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-rose-50">
            <div class="relative h-80 rounded-2xl overflow-hidden mb-6">
              <img src="https://images.unsplash.com/photo-1507311416545-92fee1c585c2?q=80&w=800&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Pesanan Khusus" />
            </div>
            <div class="px-2 pb-4 text-center">
              <h3 class="text-2xl font-serif text-[#4A2525] mb-2">Pesona Putih & Krim</h3>
              <p class="text-stone-500 text-sm mb-4">Desain yang halus, bersih, dan modern untuk sentuhan hadiah yang sempurna.</p>
              <RouterLink to="/contact" class="inline-flex items-center text-[#8B3A3A] font-bold hover:text-rose-500 transition-colors">
                Pesan Khusus <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
