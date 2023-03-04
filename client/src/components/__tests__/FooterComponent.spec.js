import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import FooterComponent from '@/components/FooterComponent.vue'

describe('FooterComponent.vue', () => {
  it('renders the header message', () => {
    const wrapper = shallowMount(FooterComponent)
    const header = wrapper.findAll('footer')
    expect(header.length).toEqual(1)
    expect(header[0].text()).toMatch('Le Footer')
  })
})
