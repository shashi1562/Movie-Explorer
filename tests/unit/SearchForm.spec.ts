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
it('submits values when valid title is provided and year is optional', async () => {
  const wrapper = mountSearchForm()

  await wrapper.find('input[placeholder="Movie Title"]').setValue('Inception')

  await wrapper.find('form').trigger('submit.prevent')

  expect(wrapper.find('.error').exists()).toBe(false)

  const emitted = wrapper.emitted('submit')
  expect(emitted).toBeTruthy()
  expect(emitted![0][0]).toEqual({
    title: 'Inception',
    year: ''
  })
})

it('submits values when all required fields are filled', async () => {
  const wrapper = mountSearchForm()

  await wrapper.find('input[placeholder="Movie Title"]').setValue('Interstellar')
  await wrapper.find('input[placeholder="Year"]').setValue('2014')

  await wrapper.find('form').trigger('submit.prevent')

  expect(wrapper.find('.error').exists()).toBe(false)

  const emitted = wrapper.emitted('submit')
  expect(emitted).toBeTruthy()
  expect(emitted![0][0]).toEqual({
    title: 'Interstellar',
    year: 2014
  })
})
})
