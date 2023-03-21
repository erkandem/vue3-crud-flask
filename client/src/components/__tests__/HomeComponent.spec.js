import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import HomeComponent from '@/components/HomeComponent.vue'

describe('HomeComponent.vue', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(HomeComponent)
    const h2 = wrapper.find('h2')
    expect(h2.text()).toMatch('Le Home')
  })
})
