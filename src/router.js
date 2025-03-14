// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import LogIn from './components/LogIn.vue';
import SignUp from './components/SignUp.vue';
import HomePage from './components/HomePage.vue';
import Friends from './components/Friends.vue';

const routes = [
  { 
    path: '/', 
    component: LogIn,
    meta: {
      requiresAuth: false
    }
  },
  { 
    path: '/signup', 
    component: SignUp,
    meta: {
      requiresAuth: false
    }
  },
  { 
    path: '/home', 
    component: HomePage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/friends',
    component: Friends,
    meta: {
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth) {
    if (!token) {
      next({ path: '/' });
    } else {
      // Verify token logic here
      try {
        const response = await fetch('http://localhost:3000/api/verifyToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          next();
        } else {
          next({ path: '/' });
        }
      } catch (error) {
        next({ path: '/' });
      }
    }
  } else {
    next();
  }
});

export default router;

