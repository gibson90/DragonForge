// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/HomePage.vue';
import Login from '@/views/LoginPage.vue';
import Register from '@/views/RegisterPage.vue';
import Dashboard from '@/views/DashboardPage.vue';
import Deckbuilder from '@/views/DeckbuilderPage.vue';
import Lobby from '@/views/LobbyPage.vue';
import Game from '@/views/GamePage.vue';
import { useAuthStore } from '@/store/modules/auth';

const routes = [
  { path: '/home', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true }},
  { path: '/deckbuilder', name: 'Deckbuilder', component: Deckbuilder, meta: { requiresAuth: true }},
  { path: '/lobby/:sessionId?', name: 'Lobby', component: Lobby, meta: { requiresAuth: true } },
  { path: '/game', name: 'Game', component: Game, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore(); // ✅ Fix: No need to pass pinia

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) { // ✅ Fix: Directly access state value
      console.log("User not authenticated, redirecting to login...");
      next({ name: 'Login' });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (authStore.isAuthenticated) {
      console.log("User already authenticated, redirecting to dashboard...");
      next({ name: 'Dashboard' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
