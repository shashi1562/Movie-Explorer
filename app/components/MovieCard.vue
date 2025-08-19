<template>
  <div class="movie-card">
    <NuxtLink :to="`/movie/${movie.id}`" class="card-link">
    <img :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''"   @error="e => { e.target.style.display='none'; e.target.nextElementSibling.style.display = 'flex' }" class="poster" />
    <div class="poster" style="background: #9f9f9f40;display: none;"></div>
      <div class="card-content">
        <h3 class="title">
          {{ movie.title }}
          <span class="year">({{ movie.release_date?.split('-')[0] || 'N/A' }})</span>
        </h3>
        <p class="overview">{{ movie.overview }}</p>
        <p class="rating">⭐ {{ movie.vote_average }}</p>
      </div>
    </NuxtLink>
    <button @click="toggleFav" class="fav-button">
      {{ isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites' }}
    </button>
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
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 320px;
  margin: auto;
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
  height: 100%;
}

.poster {
  width: 100%;
  height: 300px;
  max-height: 300px;
  object-fit: cover;
  transition: filter 0.3s ease;
  border-bottom: 1px solid #eee;
}

.card-content {
  padding: 1rem;
  flex-grow: 1;
}

.title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #222;
}

.year {
  font-weight: 400;
  font-size: 0.9rem;
  color: #777;
}

.overview {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.4;
  max-height: 4.2em;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rating {
  margin-top: 0.5rem;
  font-weight: 600;
  color: #0077ff;
}

.fav-button {
  background-color: #f0f4ff;
  color: #0077ff;
  border: none;
  padding: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border-top: 1px solid #eee;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.fav-button:hover {
  background-color: #0077ff;
  color: #fff;
}

.fav-button:active {
  transform: scale(0.97);
}
</style>
