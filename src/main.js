import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import App from './App.vue'

const routes = [
    {
        name: "Login",
        path: "/login",
        component: () => import('./Views/Login')
    },
    {
        name: "Register",
        path: "/register",
        component: () => import('./Views/Register')
    },
    {
        name: "Home",
        path: "/",
        component: () => import('./Views/Home')
    }
];

const router = new createRouter({
    history: createWebHistory(),
    base: 'localhost',
    routes
})

createApp(App).use(router).mount('#app')
