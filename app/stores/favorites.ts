import { defineStore } from 'pinia'

interface Movie {
  id: number | string
  title: string
  // Add other fields as needed
}

export const useFavoritesStore = defineStore('favorites', {
  state: (): { list: Movie[] } => ({
    list: []
  }),
  actions: {
    add(movie: Movie) {
      if (!this.list.find(m => m.id === movie.id)) {
        this.list.push(movie)
      }
    },
    remove(id: number | string) {
      this.list = this.list.filter(m => m.id !== id)
    },
    has(id: number | string): boolean {
      return this.list.some(m => m.id === id)
    }
  }
})
