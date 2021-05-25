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
    },
    {
        name: "Events",
        path: "/events",
        component: () => import('./Views/Events')
    },
    {
        name: "Event",
        path: "/events/:id",
        component: () => import('./Views/Event')
    },
    {
        name: "Create Event",
        path: "/events/create",
        component: () => import('./Views/CreateEvent')
    },
    {
        name: "Edit Event",
        path: "/events/:id/edit",
        component: () => import('./Views/EditEvent')
    },
    {
        name: "Profile",
        path: "/profile",
        component: () => import('./Views/Profile')
    },
    {
        name: "My Events",
        path: "/myevents",
        component: () => import('./Views/MyEvents')
    }
];

const router = new createRouter({
    history: createWebHistory(),
    base: 'localhost',
    routes
})

createApp(App).use(router).mount('#app')
