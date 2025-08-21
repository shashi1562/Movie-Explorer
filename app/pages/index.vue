<template>
  <SearchForm @submit="handleSearch" />

  <transition name="fade-slide">
    <div v-if="movies.length" class="movie-grid">
      <Suspense>
        <template #default>
          <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" class="fade-in" />
        </template>
        <template #fallback>
          <div class="loading">Loading results...</div>
        </template>
      </Suspense>
    </div>
  </transition>

  <transition name="fade-slide">
    <p v-if="!movies.length && searchParams.title" class="empty-state">No results found. Try another search 🎬</p>
  </transition>

  <div v-if="totalPages > 1" class="pagination-controls">
    <button  @click="changePage(currentPage - 1)"  :disabled="currentPage === 1" class="page-btn">
      ◀ Prev
    </button>
    <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn">
      Next ▶
    </button>
  </div>
</template>

<script setup>
import { defineAsyncComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTmdbApi } from '~/composables/useTmdb'
import { useMoviesStore } from '@/stores/movies'

const MovieCard = defineAsyncComponent(() =>
  import('@/components/MovieCard.vue')
)

const { searchMovies } = useTmdbApi()
const moviesStore = useMoviesStore()

const { movies, currentPage, totalPages, searchParams } = storeToRefs(moviesStore)

function handleSearch({ title, year, genre }) {
  moviesStore.setSearchParams({ title, year, genre })
  moviesStore.setCurrentPage(1)
  fetchMovies()
}

function changePage(page) {
  moviesStore.setCurrentPage(page)
  fetchMovies().then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

async function fetchMovies() {
  try {
    const { title, year, genre } = searchParams.value
    const response = await searchMovies(title, year, currentPage.value)

    let results = response.results || []
    moviesStore.setTotalPages(response.total_pages || 1)

    if (genre) {
      const genreId = parseInt(genre)
      results = results.filter(movie => movie.genre_ids?.includes(genreId))
    }

    moviesStore.setMovies(results)
  } catch (err) {
    console.error('Search failed:', err)
    moviesStore.setMovies([])
  }
}

onMounted(() => {
  if (searchParams.value.title) {
    fetchMovies()
  }
})
</script>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.75rem;
  padding: 2rem;
  animation: fadeInUp 0.6s ease;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #666;
}

.empty-state {
  text-align: center;
  margin: 2rem;
  font-size: 1.2rem;
  color: #777;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding-bottom: 2rem;
}

.page-btn {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #0077ff, #005fcc);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.page-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 119, 255, 0.4);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
  color: #444;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
}
</style>