<template>
    <SearchForm @submit="onSearch" />

    <div v-if="movies.length" class="movie-grid">
        <Suspense>
            <template #default>
                <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
            </template>
            <template #fallback>
                <p>Loading results...</p>
            </template>
        </Suspense>
    </div>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { useTmdbApi } from '~/composables/useTmdb'

// Lazy load MovieCard
const MovieCard = defineAsyncComponent(() =>
  import('@/components/MovieCard.vue')
)

const { searchMovies } = useTmdbApi()
const movies = ref([])

// Handle search submission
function onSearch({ title, year, genre }) {
  searchMovies(title, year, genre)
    .then(data => {
      movies.value = data.results || []
    })
    .catch(err => {
      console.error('Search error:', err)
    })
}
</script>

<style scoped>
.movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
    padding: 2rem;
}
</style>
