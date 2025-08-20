import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    title: '',
    year: '',
    genre: ''
  }),
  actions: {
    setSearch({ title, year, genre }: { title: string; year: string; genre: string }) {
      this.title = title
      this.year = year
      this.genre = genre
    }
  },
  persist: true // enables persisted state via localStorage
})
