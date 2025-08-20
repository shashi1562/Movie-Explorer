<template>
  <div class="movie-card">
    <NuxtLink :to="`/movie/${movie.id}`" class="card-link">
      <div class="poster-container">
        <p class="rating-badge">⭐ {{ movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A' }}</p>
        <img :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''"
          @error="e => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex' }"
          class="poster" />
        <div class="poster" style="background: #9f9f9f40;display: none;"></div>
      </div>

      <div class="card-content">
        <h3 class="title">
          {{ movie.title }}
          <span class="year">({{ movie.release_date?.split('-')[0] || 'N/A' }})</span>
        </h3>
        <p class="overview">{{ movie.overview }}</p>
      </div>
    </NuxtLink>
    <button @click="toggleFav" class="fav-button">{{ isFavorite ? '❤' : '♡' }}</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const favorites = useFavoritesStore()

const isFavorite = computed(() => favorites.has(props.movie.id))

const toggleFav = () => {
  if (isFavorite.value) {
    favorites.remove(props.movie.id)
  } else {
    favorites.add(props.movie)
  }
}
</script>
<style scoped>
.movie-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 320px;
  height: 100%;
  /* ensure equal height in grid layout */
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
}

.card-link {
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
}

.poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}
.poster-container {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.rating-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ffffffcc;
  color: #0077ff;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 8px;
  z-index: 1;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.poster-container .poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #222;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.3rem;
}

.year {
  font-weight: 400;
  font-size: 0.9rem;
  color: #777;
  margin-left: 0.3rem;
}

.overview {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.4;
  margin-top: 0.25rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rating {
  margin-top: 0.75rem;
  font-weight: 600;
  color: #0077ff;
}

.fav-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: white;
  border: none;
  font-size: 1.4rem;
  color: #e0245e; /* heart pink/red */
  padding: 0px 0.4rem;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor: pointer;
  transition: transform 0.2s ease;
  z-index: 2;
}

.fav-button:hover {
  transform: scale(1.2);
}


.fav-button:active {
  transform: scale(0.97);
}
</style>
