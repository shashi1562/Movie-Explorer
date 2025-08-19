<template>
  <div v-if="hasFavorites" class="favorites-grid">
    <Suspense>
      <template #default>
        <MovieCard v-for="movie in favoriteList" :key="movie.id" :movie="movie" />
      </template>
      <template #fallback>
        <p>Loading favorites...</p>
      </template>
    </Suspense>
  </div>
  <p v-else>No favorites yet.</p>
</template>

<script setup>
import { defineAsyncComponent, computed } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'

// Lazy load MovieCard
const MovieCard = defineAsyncComponent(() =>
  import('@/components/MovieCard.vue')
)

const favorites = useFavoritesStore()

// Memoize list and condition
const favoriteList = computed(() => favorites.list)
const hasFavorites = computed(() => favoriteList.value.length > 0)
</script>

<style scoped>
.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  padding: 1rem;
}
</style>
