<template>
  <SearchForm @submit="handleSearch" />
  <div class="sort-bar" v-show="searchParams.title">
    <label for="sort" class="sort-label">Sort by:</label>

    <select id="sort" v-model="searchParams.genre" class="sort-select">
      <option value="">All Genres</option>
      <option disabled v-if="loadingGenres">Loading...</option>
      <option v-for="g in genres" :key="g.id" :value="g.id">
        {{ g.name }}
      </option>
    </select>
  </div>

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

const genres = ref([])
const loadingGenres = ref(false)
const error = ref('')


const { fetchGenres } = useTmdbApi()

const loadGenres = async () => {
  loadingGenres.value = true
  try {
    const response = await fetchGenres()
    genres.value = response.genres || []
  } catch (err) {
    console.error('Failed to load genres:', err)
    error.value = 'Could not load genres.'
  } finally {
    loadingGenres.value = false
  }
}

onMounted(() => {
  loadGenres()
})

watch(() => searchParams.value.genre,
  () => {
    moviesStore.setCurrentPage(1)
    fetchMovies()
  }
)

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

.sort-bar {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.sort-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.sort-select {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: #fff;
  color: #111827;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  min-width: 180px;
}

.sort-select:focus {
  outline: none;
  border-color: #3b82f6;
  /* blue-500 */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.sort-select option[disabled] {
  color: #9ca3af;
}
</style>