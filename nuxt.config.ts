export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    tmdbToken: '', // Private by default
    public: {
      tmdbToken: process.env.TMDB_TOKEN, // Expose to client-side
    },
  },
    app: {
    baseURL: '/Movie-Explorer/',
    buildAssetsDir: 'assets'
  },
  nitro: {
    preset: 'github-pages'
  }
})

