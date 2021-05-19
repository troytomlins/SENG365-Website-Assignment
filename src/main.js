import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import 'bootstrap'
import App from './App.vue'

// Import bootstrap (installed using npm)
import 'bootstrap/dist/css/bootstrap.css';

const routes = [
    {
        path: "/login",
        component: () => import('./Views/Login')
    },
    {
        path: "/register",
        component: () => import('./Views/Register')
    },
    {
        path: "/register",
        component: () => import('./Views/Register')
    }
];

const router = new createRouter({
    history: createWebHistory(),
    base: 'localhost',
    routes
})

createApp(App).use(router).mount('#app')
