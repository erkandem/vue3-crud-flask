import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import HeaderComponent from '@/components/HeaderComponent.vue'

describe(HeaderComponent.vue, () => {
  it('renders the header message', () => {
    const wrapper = shallowMount(HeaderComponent)
    const header = wrapper.findAll('header')
    expect(header.length).toEqual(1)
    expect(header[0].text()).toMatch('Le Header')
  })
})
