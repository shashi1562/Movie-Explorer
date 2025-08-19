<template>
    <div v-if="movie" class="movie-container" role="main" aria-label="Movie Details">
        <!-- Backdrop Hero -->
        <section class="hero" :style="{ backgroundImage: movie.backdrop_path ? `linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.1)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` : 'none' }">
            <div class="hero-content">
                <img class="poster" :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''" loading="lazy" @error="e => { e.target.style.display = 'none';e.target.nextElementSibling.style.display = 'flex';}" />
                <div class="poster-fallback" role="img" aria-label="No poster available">No Image</div>

                <article class="info">
                    <h1>{{ movie.title }}</h1>
                    <p class="tagline" v-if="movie.tagline" tabindex="0">“{{ movie.tagline }}”</p>
                    <p class="overview" tabindex="0">{{ movie.overview }}</p>

                    <section class="meta" aria-label="Movie metadata">
                        <p><strong>Genres:</strong> {{movie.genres.map(g => g.name).join(', ')}}</p>
                        <p><strong>Runtime:</strong> {{ movie.runtime }} min</p>
                        <p><strong>Release Date:</strong> {{ new Date(movie.release_date).toLocaleDateString() }}</p>
                        <p><strong>Rating:</strong> ⭐ {{ movie.vote_average.toFixed(1) }} / 10 ({{
                            movie.vote_count.toLocaleString() }} votes)</p>
                        <p><strong>Language:</strong> {{movie.spoken_languages.map(l => l.english_name).join(', ')}}
                        </p>
                        <p><strong>Country:</strong> {{movie.production_countries.map(c => c.name).join(', ')}}</p>
                    </section>

                    <nav class="links" aria-label="External links">
                        <a :href="`https://www.imdb.com/title/${movie.imdb_id}`" target="_blank"
                            rel="noopener noreferrer">View on IMDb</a>
                        <a v-if="movie.homepage" :href="movie.homepage" target="_blank"
                            rel="noopener noreferrer">Official Site</a>
                    </nav>

                    <!-- Collection -->
                    <section v-if="movie.belongs_to_collection" class="collection" aria-label="Belongs to collection">
                        <img :src="`https://image.tmdb.org/t/p/w200${movie.belongs_to_collection.poster_path}`"
                            :alt="`Collection poster: ${movie.belongs_to_collection.name}`" loading="lazy" />
                        <p tabindex="0">{{ movie.belongs_to_collection.name }}</p>
                    </section>
                </article>
            </div>
        </section>

        <!-- Production Companies -->
        <section v-if="movie.production_companies.length" class="production" aria-label="Production Companies">
            <h2>Production Companies</h2>
            <div class="logos">
                <article v-for="company in movie.production_companies" :key="company.id" class="company" tabindex="0"
                    aria-label="Production company">
                    <img v-if="company.logo_path" :src="`https://image.tmdb.org/t/p/w200${company.logo_path}`"
                        :alt="company.name" loading="lazy" />
                    <p>{{ company.name }}</p>
                </article>
            </div>
        </section>
    </div>

    <div v-else class="loading" role="alert" aria-live="assertive">Loading movie details...</div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useTmdbApi } from '~/composables/useTmdb'

const route = useRoute()
const { fetchMovieDetails } = useTmdbApi()

const { data: movie } = await useAsyncData('movie', () =>
    fetchMovieDetails(route.params.id)
)
</script>

<style scoped>
.movie-container {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.6);
    min-height: 100vh;
}

.hero {
    background-size: cover;
    background-position: center center;
    padding: 3rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-image 0.5s ease-in-out;
}

.hero-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1200px;
    width: 100%;
}

@media (min-width: 768px) {
    .hero-content {
        flex-direction: row;
    }
}

.poster {
    width: 300px;
    max-width: 100%;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
    object-fit: cover;
    user-select: none;
}

.poster-fallback {
    width: 300px;
    height: 450px;
    display: none;
    background-color: #7a7a7a;
    color: #222;
    font-weight: 700;
    font-size: 1.2rem;
    border-radius: 12px;
    align-items: center;
    justify-content: center;
    user-select: none;
}

.info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.tagline {
    font-style: italic;
    color: #bbb;
    font-size: 1.125rem;
}

.overview {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #ddd;
}

.meta p {
    margin: 0.3rem 0;
    color: #ccc;
}

.links a {
    color: #4ecdc4;
    margin-right: 1rem;
    text-decoration: underline;
    font-weight: 600;
    transition: color 0.3s ease;
}

.links a:hover,
.links a:focus {
    color: #2a9d8f;
    outline: none;
}

.collection {
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: rgba(255, 255, 255, 0.07);
    padding: 1rem 1.5rem;
    border-radius: 8px;
}

.collection img {
    height: 100px;
    border-radius: 8px;
    object-fit: contain;
}

.production {
    padding: 2rem 1.5rem;
    max-width: 1200px;
    margin: 0 auto 3rem;
}

.production h2 {
    color: #eee;
    margin-bottom: 1rem;
    font-weight: 700;
    font-size: 1.5rem;
}

.logos {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
}

.company {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 160px;
    text-align: center;
    color: #ccc;
    font-weight: 600;
    user-select: none;
}

.company img {
    max-width: 100px;
    max-height: 60px;
    object-fit: contain;
    margin-bottom: 0.5rem;
}

.loading {
    color: #ccc;
    text-align: center;
    padding: 4rem;
    font-size: 1.25rem;
    font-weight: 600;
}
</style>
