<template>
    <form class="search-form" @submit.prevent="onSubmit">
        <div class="form-group fade-in">
            <input v-model="form.title" placeholder="Movie Title" :class="{ invalid: error && !form.title.trim() }" />
        </div>
        <div class="form-group fade-in" style="animation-delay: 0.1s">
            <input v-model="form.year" type="number" placeholder="Release Year" />
        </div>
        <div class="form-group fade-in" style="animation-delay: 0.2s">
            <select v-model="form.genre">
                <option value="">All Genres</option>
                <option disabled v-show="loadingGenres">Loading genres...</option>
                <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
        </div>
        <button type="submit" class="submit-button fade-in" style="animation-delay: 0.3s">Search</button>
        <transition name="fade-slide">
            <p v-if="error" class="error">{{ error }}</p>
        </transition>
    </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useTmdbApi } from '@/composables/useTmdb'  // adjust the path if necessary

const emit = defineEmits(['submit'])

const form = reactive({
    title: '',
    year: '',
    genre: ''
})

const error = ref('')
const results = ref([])
const genres = ref([])  // Store fetched genres

const { searchMovies, fetchGenres } = useTmdbApi()  // Use both API functions

const loadingGenres = ref(false)

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

const onSubmit = async () => {
    form.genre = form.genre.trim()
    form.year = form.year.trim()
    
    if (!form.title.trim()) {
        error.value = 'Movie title is required.'
        return
    }

    error.value = ''

    try {
        const response = await searchMovies(form.title, form.year, form.genre, 1)
        results.value = response.results || []
        emit('submit', { ...form, results: results.value })
    } catch (err) {
        console.error('Failed to fetch movies:', err)
        error.value = 'Something went wrong while fetching movies.'
    }
}

</script>


<style scoped>
/* Base layout */
input.invalid {
    border-color: #d93025;
    box-shadow: 0 0 0 3px rgba(217, 48, 37, 0.1);
}

.search-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    background: linear-gradient(to right, #ffffff, #f9f9f9);
    border-radius: 12px;
    max-width: 480px;
    margin: 2rem auto;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
}

.search-form:hover {
    box-shadow: 0 18px 34px rgba(0, 0, 0, 0.15);
}

/* Form elements */
input,
select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    transition: border 0.2s ease, box-shadow 0.2s ease;
    background: #fff;
}

input:focus,
select:focus {
    outline: none;
    border-color: #0077ff;
    box-shadow: 0 0 0 3px rgba(0, 119, 255, 0.2);
}

.submit-button {
    padding: 0.75rem 1.5rem;
    background-color: #0077ff;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-button:hover {
    background-color: #005fcc;
    transform: translateY(-2px);
}

.submit-button:active {
    transform: scale(0.98);
}

/* Error message */
.error {
    color: #d93025;
    font-weight: 500;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: #fdecea;
    border-left: 4px solid #d93025;
    border-radius: 4px;
}

/* Animations */
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

/* Error message transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
