// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import dataInventaris from '../components/inventaris.vue';
import dataAnggota from '../components/anggota.vue';

const routes = [
    { 
        path: '/', 
        name: 'Home', 
        component: dataInventaris,
        meta: { requiresAuth: true }
    },
    { 
        path: '/login', 
        name: 'Login', 
        component: Login 
    },
    { 
        path: '/anggota', 
        name: 'Anggota', 
        component: dataAnggota 
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('bearer_token');

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'Login' });
    } else if (to.name === 'Login' && isAuthenticated) {
        next({ name: 'Home' });
    } else {
        next();
    }
});

export default router;