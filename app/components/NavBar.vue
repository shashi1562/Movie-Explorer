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
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 50;
  transition: background 0.4s ease, box-shadow 0.4s ease;
}

.nav-link {
  position: relative;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  color: #374151;
  padding: 0.6rem 1.4rem;
  border-radius: 12px;
  letter-spacing: 0.4px;
  transition: color 0.3s ease, transform 0.25s ease, box-shadow 0.3s ease;
  z-index: 1;
}

.nav-link::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 2px;
  border-radius: 12px;
  background: linear-gradient(90deg, #0077ff, #00c6ff, #00ffea);
  background-size: 300% 300%;
  animation: gradientBorder 4s linear infinite;
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
          mask-composite: exclude;
  z-index: -1;
}

.nav-link:hover {
  color: #0077ff;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 14px rgba(0, 119, 255, 0.15);
}

.active {
  color: #0077ff;
  font-weight: 700;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 119, 255, 0.25) inset;
}

@keyframes gradientBorder {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

</style>