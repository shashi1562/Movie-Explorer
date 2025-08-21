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
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background 0.4s ease, box-shadow 0.4s ease;
}

.nav-link {
  position: relative;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  color: #374151; 
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  transition: color 0.3s ease, background 0.3s ease, transform 0.2s ease;
  letter-spacing: 0.3px;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0%;
  height: 2px;
  background: linear-gradient(to right, #0077ff, #00c6ff);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #0077ff;
  background: rgba(0, 119, 255, 0.06);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 119, 255, 0.1);
}

.nav-link:hover::after {
  width: 80%;
}

.active {
  color: #0077ff;
  font-weight: 700;
  background: rgba(0, 119, 255, 0.1);
  box-shadow: 0 2px 6px rgba(0, 119, 255, 0.15) inset;
}

.active::after {
  width: 80%;
}
</style>