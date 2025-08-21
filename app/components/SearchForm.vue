<template>
    <div class="search-wrapper">
        <form class="search-form" @submit.prevent="onSubmit">
            <input v-model="form.title" placeholder="Movie Title" :class="{ invalid: error && !form.title.trim() }" />
            <input v-model="form.year" type="number" placeholder="Year" />
            <select v-model="form.genre">
                <option value="">All Genres</option>
                <option disabled v-show="loadingGenres">Loading...</option>
                <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
            <button type="submit" class="submit-button">Search</button>
        </form>

        <transition name="fade-slide">
            <p v-if="error" class="error">{{ error }}</p>
        </transition>
    </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useTmdbApi } from '@/composables/useTmdb'

const emit = defineEmits(['submit'])
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'

// Pinia store
const searchStore = useSearchStore()
const { title, year, genre } = storeToRefs(searchStore)


const form = reactive({
  get title() {
    return title.value
  },
  set title(val) {
    title.value = val
  },
  get year() {
    return year.value
  },
  set year(val) {
    year.value = val
  },
  get genre() {
    return genre.value
  },
  set genre(val) {
    genre.value = val
  }
})


const error = ref('')
const genres = ref([])
const loadingGenres = ref(false)

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

const onSubmit = () => {
    if (!form.title.trim()) {
        error.value = 'Movie title is required.'
        return
    }

    error.value = ''
    emit('submit', {
        title: form.title,
        year: form.year,
        genre: form.genre
    })
}
</script>

<style scoped>
input.invalid {
    border-color: #d93025;
    box-shadow: 0 0 0 3px rgba(217, 48, 37, 0.1);
}

.search-wrapper {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    padding: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.search-form {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.search-form input,
.search-form select {
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    min-width: 160px;
    flex: 1;
}

.search-form input.invalid {
    border-color: #d93025;
    box-shadow: 0 0 0 3px rgba(217, 48, 37, 0.1);
}

.submit-button {
    padding: 0.5rem 1rem;
    background-color: #0077ff;
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.3s ease;
}

.submit-button:hover {
    background-color: #005fcc;
}

.error {
    margin-top: 0.5rem;
    color: #d93025;
    background-color: #fdecea;
    padding: 0.5rem;
    border-left: 4px solid #d93025;
    border-radius: 4px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}


@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translateY(15px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    opacity: 0;
    animation: fadeInUp 0.5s ease forwards;
}
</style>