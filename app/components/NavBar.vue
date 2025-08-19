<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
    <nav class="navbar">
        <NuxtLink to="/" class="nav-link" :class="{ active: route.path === '/' }">Search</NuxtLink>
        <NuxtLink to="/favorites" class="nav-link" :class="{ active: route.path === '/favorites' }">Favorites</NuxtLink>
    </nav>
</template>

<style scoped>
.navbar {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem 2rem;
    background: linear-gradient(to right, #ffffff, #f1f3f5);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: blur(8px);
    border-bottom: 1px solid #e0e0e0;
    transition: background 0.3s ease;
}

.nav-link {
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link::after {
    content: "";
    position: absolute;
    bottom: 4px;
    left: 0;
    width: 0%;
    height: 2px;
    background-color: #0077ff;
    transition: width 0.3s ease;
}

.nav-link:hover {
    color: #0077ff;
    background-color: #e9f2ff;
}

.nav-link:hover::after {
    width: 100%;
}

.active {
    color: #0077ff;
    font-weight: 700;
    background-color: #e0f0ff;
    border-radius: 6px;
}
</style>
