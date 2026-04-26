<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: ''
})

const sendToWhatsApp = () => {
  const text = `Hello Kokorokara,\n\nName: ${form.value.name}\nEmail: ${form.value.email}\n\nMessage:\n${form.value.message}`
  
  const encoded = encodeURIComponent(text)
  window.open(`https://wa.me/62881037320409?text=${encoded}`, '_blank')
}
</script>

<template>
  <div class="min-h-screen bg-transparent pt-40 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-serif text-[#4A2525] mb-4">Let's Talk Flowers</h1>
        <p class="text-stone-500 max-w-2xl mx-auto">We are very happy to hear from you. Whether it's a special bouquet order, for a special event, or just to ask about our collection.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <!-- Contact Info -->
        <div class="space-y-10">
          <div class="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-[#8B3A3A]/10">
            <h3 class="text-3xl font-serif text-[#4A2525] mb-8">Contact Us</h3>
            
            <div class="space-y-8">
              <div class="flex items-start space-x-5 group">
                <div class="w-14 h-14 bg-rose-50 group-hover:bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#8B3A3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="pt-1">
                  <h4 class="text-sm font-bold text-stone-900 uppercase tracking-widest mb-1">Visit Boutique</h4>
                  <p class="text-stone-500 leading-relaxed text-base">Online Order Only</p>
                </div>
              </div>

              <div class="flex items-start space-x-5 group">
                <div class="w-14 h-14 bg-rose-50 group-hover:bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#8B3A3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="pt-1">
                  <h4 class="text-sm font-bold text-stone-900 uppercase tracking-widest mb-1">Opening Hours</h4>
                  <p class="text-stone-500 leading-relaxed text-base">9 AM - 7 PM</p>
                </div>
              </div>

              <div class="flex items-start space-x-5 group">
                <div class="pt-1 w-full">
                  <h4 class="text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">Connect With Us</h4>
                  <div class="flex space-x-4">
                    <!-- Email logo -->
                    <a href="mailto:hello@kokorokara.com" class="w-12 h-12 bg-rose-50 hover:bg-rose-100 rounded-xl flex items-center justify-center transition-colors text-[#8B3A3A]" title="Email Us">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </a>
                    <!-- Instagram logo -->
                    <a href="https://instagram.com/kokorokara" target="_blank" class="w-12 h-12 bg-rose-50 hover:bg-rose-100 rounded-xl flex items-center justify-center transition-colors text-[#8B3A3A]" title="Instagram">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                    <!-- Tiktok logo -->
                    <a href="https://tiktok.com/@kokorokara" target="_blank" class="w-12 h-12 bg-rose-50 hover:bg-rose-100 rounded-xl flex items-center justify-center transition-colors text-[#8B3A3A]" title="TikTok">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-[#FDFBF7] p-8 md:p-10 rounded-[2rem] shadow-sm border border-[#EAE3D9]">
          <h3 class="text-3xl font-serif text-[#2C1810] mb-2">Send Us a Message</h3>
          <p class="text-stone-600 mb-8">Fill out the form below and we'll get back to you shortly.</p>
          
          <form class="space-y-6" @submit.prevent="sendToWhatsApp">
            <div>
              <label class="block text-sm font-semibold text-[#2C1810] mb-2">Full Name</label>
              <input v-model="form.name" type="text" placeholder="Your name" class="w-full px-4 py-3 bg-white rounded-[1rem] border border-[#EAE3D9] focus:outline-none focus:border-[#C0848A] focus:ring-1 focus:ring-[#C0848A] transition-colors" required />
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-[#2C1810] mb-2">Email Address</label>
              <input v-model="form.email" type="email" placeholder="your@email.com" class="w-full px-4 py-3 bg-white rounded-[1rem] border border-[#EAE3D9] focus:outline-none focus:border-[#C0848A] focus:ring-1 focus:ring-[#C0848A] transition-colors" required />
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#2C1810] mb-2">Your Message</label>
              <textarea v-model="form.message" rows="3" placeholder="Tell us about your flower needs..." class="w-full px-4 py-3 bg-white rounded-[1rem] border border-[#EAE3D9] focus:outline-none focus:border-[#C0848A] focus:ring-1 focus:ring-[#C0848A] transition-colors resize-none" required></textarea>
            </div>
            
            <div class="pt-2">
              <button type="submit" class="w-full bg-[#C1838A] hover:bg-[#ad7479] text-white py-4 rounded-[1.5rem] font-semibold transition-colors flex items-center justify-center space-x-2 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send">
                  <path d="m22 2-7 20-4-9-9-4Z"/>
                  <path d="M22 2 11 13"/>
                </svg>
                <span>Send Message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delivery Areas Section (Matched with Home) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
      <div class="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-[#8B3A3A]/10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <!-- Left: Delivery Info -->
          <div>
            <span class="inline-block py-1 px-3 border border-rose-300 text-rose-500 text-xs font-bold uppercase tracking-wider mb-6">ISLAND-WIDE DELIVERY</span>
            <h2 class="text-3xl md:text-4xl font-serif text-[#4A2525] mb-6">Same Day Delivery Across Bali</h2>
            <p class="text-stone-500 leading-relaxed mb-10 text-lg">
              From the surf in Uluwatu to the rice paddies of Ubud, we've got you covered. Order before 3 PM and receive your blooms the same day.
            </p>
            <div class="space-y-6">
              <div class="border-l-2 border-[#8B3A3A] pl-4">
                <h4 class="font-bold text-[#4A2525] mb-1">Same-Day Delivery</h4>
                <p class="text-stone-500 text-sm">Order by 3 PM for same-day delivery</p>
              </div>
              <div class="border-l-2 border-[#8B3A3A] pl-4">
                <h4 class="font-bold text-[#4A2525] mb-1">Hand-Delivered</h4>
                <p class="text-stone-500 text-sm">Each bouquet delivered with care</p>
              </div>
              <div class="border-l-2 border-[#8B3A3A] pl-4">
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
                  <div class="w-1.5 h-1.5 bg-rose-400 mr-2"></div>
                  <h4 class="font-bold text-[#4A2525]">Priority Delivery</h4>
                </div>
                <span class="text-xs text-stone-400">Same Day</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span class="px-4 py-2 bg-[#EE8888] text-white text-sm font-semibold rounded-lg shadow-sm">Canggu</span>
                <span class="px-4 py-2 bg-[#EE8888] text-white text-sm font-semibold rounded-lg shadow-sm">Seminyak</span>
                <span class="px-4 py-2 bg-[#EE8888] text-white text-sm font-semibold rounded-lg shadow-sm">Kuta</span>
              </div>
            </div>
            <div class="mb-10">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <div class="w-1.5 h-1.5 bg-rose-400 mr-2"></div>
                  <h4 class="font-bold text-[#4A2525]">Extended Coverage</h4>
                </div>
                <span class="text-xs text-stone-400">Order by 10 AM</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span class="px-4 py-2 border border-rose-300 text-rose-500 text-sm font-semibold bg-white rounded-lg shadow-sm">Ubud</span>
                <span class="px-4 py-2 border border-rose-300 text-rose-500 text-sm font-semibold bg-white rounded-lg shadow-sm">Uluwatu</span>
                <span class="px-4 py-2 border border-rose-300 text-rose-500 text-sm font-semibold bg-white rounded-lg shadow-sm">Sanur</span>
                <span class="px-4 py-2 border border-rose-300 text-rose-500 text-sm font-semibold bg-white rounded-lg shadow-sm">Jimbaran</span>
              </div>
            </div>
            <div class="border-l-2 border-[#EE8888] pl-4">
              <p class="text-sm text-stone-500">
                <strong class="text-stone-700">Pro Tip:</strong> Don't see your area? Contact us—we often deliver beyond our standard zones!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
