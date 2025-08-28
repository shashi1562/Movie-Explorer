import { mount } from '@vue/test-utils'
import MovieCard from '../../app/components/MovieCard.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia, defineStore } from 'pinia'

const stubs = {
    NuxtLink: { template: '<a><slot /></a>' }
}

const mockMovie = {
    id: 42,
    title: 'The Matrix',
    release_date: '1999-03-31',
    vote_average: 8.7,
    overview: 'A computer hacker learns about the true nature of reality.',
    poster_path: '/matrix.jpg'
}

const useMockFavoritesStore = defineStore('favorites', {
    state: () => ({
        items: [] as any[]
    }),
    actions: {
        add(movie:string) {
            this.items.push(movie)
        },
        remove(id:number) {
            this.items = this.items.filter(m => m.id !== id)
        },
        has(id) {
            return this.items.some(m => m.id === id)
        }
    }
})

describe('MovieCard.vue - Favorites', () => {
    let pinia: ReturnType<typeof createPinia>
    let favorites: ReturnType<typeof useMockFavoritesStore>

    beforeEach(() => {
        pinia = createPinia()
        setActivePinia(pinia)
        favorites = useMockFavoritesStore()
    })

    it('adds movie to favorites when not already favorited', async () => {
        const wrapper = mount(MovieCard, {
            props: { movie: mockMovie },
            global: {
                plugins: [pinia],
                stubs
            }
        })

        expect(favorites.has(mockMovie.id)).toBe(false)

        await wrapper.find('.fav-button').trigger('click')

        expect(favorites.has(mockMovie.id)).toBe(true)
    })

    it('removes movie from favorites when already favorited', async () => {
        favorites.add(mockMovie)

        const wrapper = mount(MovieCard, {
            props: { movie: mockMovie },
            global: {
                plugins: [pinia],
                stubs
            }
        })

        expect(favorites.has(mockMovie.id)).toBe(true)

        await wrapper.find('.fav-button').trigger('click')

        expect(favorites.has(mockMovie.id)).toBe(false)
    })
})