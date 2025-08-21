<template>
  <div class="movie-card">
    <NuxtLink :to="`/movie/${movie.id}`" class="card-link">
      <div class="poster-container">
        <p class="rating-badge">⭐ {{ movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A' }}</p>
        <img :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''"
          @error="e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex' }" class="poster" />
        <div class="poster fallback"></div>
      </div>

      <div class="card-content">
        <h3 class="title"> {{ movie.title }}
          <span class="year">({{ movie.release_date?.split('-')[0] || 'N/A' }})</span>
        </h3>
        <p class="overview">{{ movie.overview }}</p>
      </div>
    </NuxtLink>
    <button @click="toggleFav" class="fav-button" :class="{ active: isFavorite }">
      {{ isFavorite ? '❤' : '♡' }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'

const props = defineProps({
  movie: { type: Object, required: true }
})

const favorites = useFavoritesStore()
const isFavorite = computed(() => favorites.has(props.movie.id))

const toggleFav = () => {
  isFavorite.value ? favorites.remove(props.movie.id) : favorites.add(props.movie)
}
</script>

<style scoped>
.movie-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  max-width: 320px;
  cursor: pointer;
  animation: fadeIn 0.6s ease forwards;
}

.movie-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 14px 34px rgba(0,0,0,0.12);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.poster-container {
  position: relative;
  height: 320px;
  overflow: hidden;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  animation: fadeIn 1s ease forwards;
}

.poster.fallback {
  background: linear-gradient(135deg, #9f9f9f30, #cfcfcf50);
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #555;
}

.rating-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(6px);
  color: #0077ff;
  padding: 0.3rem 0.6rem;
  font-size: 0.85rem;
  font-weight: 700;
  border-radius: 8px;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1d1d1d;
  margin-bottom: 0.3rem;
  line-height: 1.3;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}
.movie-card:hover .title {
  background: linear-gradient(135deg, #0077ff, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  transition: all 0.3s ease;
}

.year {
  font-weight: 400;
  font-size: 0.9rem;
  color: #666;
  margin-left: 0.4rem;
}

.overview {
  font-size: 0.93rem;
  color: #444;
  line-height: 1.45;
  margin-top: 0.25rem;
  flex-grow: 1;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fav-button {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #fff;
  border: none;
  font-size: 1.4rem;
  color: #e0245e;
  padding: 0;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  cursor: pointer;
  transition: transform 0.25s ease, background 0.3s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fav-button:hover {
  transform: scale(1.15);
  background: #ffeaf0;
}

.fav-button.active {
  animation: heartbeat 0.4s ease;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1); }
  75% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes fadeIn {
  to { opacity: 1; }
}
</style>