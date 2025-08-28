import { mount, VueWrapper } from '@vue/test-utils'
import SearchForm from '../../app/components/SearchForm.vue'
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'

vi.mock('../../app/composables/useTmdb', () => ({
  useTmdbApi: () => ({
    fetchGenres: vi.fn().mockResolvedValue({ genres: [{ id: 1, name: 'Action' }] })
  })
}))

const mountSearchForm = () =>
  mount(SearchForm, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })]
    }
  })

describe('SearchForm.vue', () => {
  it('shows error when submitting without title', async () => {
    const wrapper = mountSearchForm()

    await wrapper.find('form').trigger('submit.prevent')

    const error = wrapper.find('.error')
    expect(error.exists()).toBe(true)
    expect(error.text()).toBe('Movie title is required.')
    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('emits submit when valid title is provided and year is omitted', async () => {
    const wrapper = mountSearchForm()

    await wrapper.find('input[placeholder="Movie Title"]').setValue('Inception')
    await wrapper.find('select').setValue('1')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error').exists()).toBe(false)

    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toEqual({
      title: 'Inception',
      year: '',
      genre: 1
    })
  })

  it('emits submit when all fields are filled', async () => {
    const wrapper = mountSearchForm()

    await wrapper.find('input[placeholder="Movie Title"]').setValue('Interstellar')
    await wrapper.find('input[placeholder="Year"]').setValue('2014')
    await wrapper.find('select').setValue('1')

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.find('.error').exists()).toBe(false)

    const emitted = wrapper.emitted('submit')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toEqual({
      title: 'Interstellar',
      year: 2014,
      genre: 1
    })
  })
})
