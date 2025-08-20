import { defineStore } from 'pinia'

interface Movie {
  id: number
  title: string
  genre_ids: number[]
  // Add any other needed fields (poster_path, etc.)
}

interface SearchParams {
  title: string
  year: string
  genre: string
}

export const useMoviesStore = defineStore('movies', {
  state: () => ({
    movies: [] as Movie[],
    currentPage: 1,
    totalPages: 1,
    searchParams: {
      title: '',
      year: '',
      genre: ''
    } as SearchParams
  }),
  actions: {
    setMovies(movies: Movie[]) {
      this.movies = movies
    },
    setCurrentPage(page: number) {
      this.currentPage = page
    },
    setTotalPages(total: number) {
      this.totalPages = total
    },
    setSearchParams(params: SearchParams) {
      this.searchParams = params
    }
  },
  persist: true
})
