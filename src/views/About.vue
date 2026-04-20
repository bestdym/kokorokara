<template>
  <div class="min-h-screen bg-white pt-40 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <!-- Image -->
        <div class="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-rose-100 p-2 bg-[#FFFBF8]">
          <div class="w-full h-full rounded-2xl overflow-hidden">
            <img src="https://images.unsplash.com/photo-1572454591674-2739f30d8c40?w=800&auto=format&fit=crop" class="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" alt="Pembuat Bunga (Florist)" />
          </div>
        </div>

        <!-- Content -->
        <div>
          <span class="inline-block py-1 px-3 rounded-full bg-rose-100 text-rose-800 text-sm font-semibold tracking-wider mb-4 border border-rose-200">
            TENTANG KAMI
          </span>
          <h1 class="text-4xl md:text-5xl font-serif text-[#4A2525] mb-6">Cerita Di Balik Kokorokara</h1>
          <p class="text-lg text-stone-600 mb-6 font-light leading-relaxed">
            Selamat datang di Kokorokara, tempat di mana puisi berpadu dengan kelopak bunga. Didirikan dari semangat untuk membawa mahakarya terindah alam ke dalam setiap momen terpenting, kami percaya bahwa setiap buket menceritakan kisahnya sendiri.
          </p>
          <p class="text-lg text-stone-600 mb-8 font-light leading-relaxed">
            Berawal dari mimpi kecil untuk merangkai keindahan, Kokorokara telah mekar menjadi butik kesayangan yang mengutamakan kualitas, kreativitas, dan sukacita dalam berbagi. Setiap tangkai dalam koleksi kami dipilih dengan ketelitian dan dirangkai dengan rasa cinta.
          </p>
          
          <div class="grid grid-cols-2 gap-8 mb-10">
            <div class="bg-[#FFFBF8] p-6 rounded-3xl border border-rose-50 text-center">
              <h3 class="text-4xl font-serif text-[#8B3A3A] mb-2 drop-shadow-sm">10k+</h3>
              <p class="text-stone-500 text-xs uppercase tracking-widest font-bold">Pelanggan Puas</p>
            </div>
            <div class="bg-[#FFFBF8] p-6 rounded-3xl border border-rose-50 text-center">
              <h3 class="text-4xl font-serif text-[#8B3A3A] mb-2 drop-shadow-sm">100%</h3>
              <p class="text-stone-500 text-xs uppercase tracking-widest font-bold">Buatan Tangan</p>
            </div>
          </div>

          <button class="bg-[#8B3A3A] hover:bg-[#682a2a] text-white px-8 py-4 rounded-full text-sm font-bold tracking-wider transition-all shadow-xl shadow-[#8B3A3A]/30 w-full sm:w-auto">
            Kenali Tim Florist Kami
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
