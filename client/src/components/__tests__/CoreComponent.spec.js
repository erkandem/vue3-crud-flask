import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import CoreComponent from '@/components/CoreComponent.vue'

describe('CoreComponent.vue', () => {
  it('renders the header message', () => {
    const wrapper = shallowMount(CoreComponent)
    const header = wrapper.findAll('main')
    expect(header.length).toEqual(1)
    expect(header[0].text()).toMatch('Le Content')
  })
})
