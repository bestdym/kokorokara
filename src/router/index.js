import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase'
import Home from '../views/Home.vue'
import Catalog from '../views/Catalog.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import AdminLogin from '../views/AdminLogin.vue'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'beranda', component: Home },
    { path: '/catalog', name: 'katalog', component: Catalog },
    { path: '/about', name: 'tentang', component: About },
    { path: '/contact', name: 'kontak', component: Contact },
    { path: '/admin', name: 'admin', component: AdminLogin },
    { 
      path: '/dashboard', 
      name: 'dashboard', 
      component: Dashboard,
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

// Authentication Guard Middleware
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      next('/admin') // Redirect to login if not authenticated
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
