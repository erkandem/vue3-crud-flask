import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import HomeComponent from '@/components/HomeComponent.vue'

describe('HomeComponent.vue', () => {
  it('renders the component', () => {
    const wrapper = shallowMount(HomeComponent)
    const h3 = wrapper.find('h3')
    expect(h3.text()).toMatch('Le Home')
  })
})
