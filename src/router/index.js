import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/Login.vue'
import Home from '../views/Home.vue'
import { auth } from '@/firebase'
import { onAuthStateChanged } from "firebase/auth";
import Swal from 'sweetalert2';

const routes = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/yan-pages/home',
    name: 'HomePage',
    component: () => import('@/views/Yan Pages/HomePage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/yan-pages/about',
    name: 'AboutPage',
    component: () => import('@/views/Yan Pages/AboutPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/yan-pages/features',
    name: 'FiturPage',
    component: () => import('@/views/Yan Pages/FiturPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/yan-pages/themes',
    name: 'TemaPage',
    component: () => import('@/views/Yan Pages/TemaPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/yan-pages/prices',
    name: 'HargaPage',
    component: () => import('@/views/Yan Pages/HargaPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/yan-pages/contact',
    name: 'ContactPage',
    component: () => import('@/views/Yan Pages/ContactPage.vue'),
    meta: {
      requiresAuth: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth, (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if(to.matched.some((record) => record.meta.requiresAuth)) {
    if(await getCurrentUser()) {
      next()
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Request denied',
        text: 'You must be logged in to access this page',
      })
      next('/')
    }
  } else {
    next()
  }
})

export default router
