<template>
  <SearchForm @submit="handleSearch" />

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

  <div v-if="totalPages > 1" class="pagination-controls">
    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTmdbApi } from '~/composables/useTmdb'
import { useMoviesStore } from '@/stores/movies'

// Lazy load MovieCard
const MovieCard = defineAsyncComponent(() =>
  import('@/components/MovieCard.vue')
)

// TMDB search function
const { searchMovies } = useTmdbApi()

// Use persisted movies store
const moviesStore = useMoviesStore()

// Destructure state from store
const { movies, currentPage, totalPages, searchParams } = storeToRefs(moviesStore)

// Handle form submission from SearchForm
function handleSearch({ title, year, genre }) {
  moviesStore.setSearchParams({ title, year, genre })
  moviesStore.setCurrentPage(1)
  fetchMovies()
}

// Handle pagination
function changePage(page) {
  moviesStore.setCurrentPage(page)
  fetchMovies().then(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
}

// Fetch movies from API
async function fetchMovies() {
  try {
    const { title, year, genre } = searchParams.value
    const response = await searchMovies(title, year, currentPage.value)

    let results = response.results || []
    moviesStore.setTotalPages(response.total_pages || 1)

    // Filter by genre locally if selected
    if (genre) {
      const genreId = parseInt(genre)
      results = results.filter(movie =>
        movie.genre_ids?.includes(genreId)
      )
    }

    moviesStore.setMovies(results)
  } catch (err) {
    console.error('Search failed:', err)
    moviesStore.setMovies([])
  }
}

// Auto-fetch if form state is already stored
onMounted(() => {
  if (searchParams.value.title) {
    fetchMovies()
  }
})
</script>


<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding-bottom: 2rem;
}

.pagination-controls button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: #f9f9f9;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
