export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    tmdbToken: '', // Private by default
    public: {
      tmdbToken: process.env.TMDB_TOKEN, // Expose to client-side
    },
  },
})

