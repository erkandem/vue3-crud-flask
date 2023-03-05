import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import CoreComponent from '@/components/CoreComponent.vue'

describe('CoreComponent.vue', () => {
  it('renders the CoreComponent with one main element and RouterView component', () => {
    const wrapper = shallowMount(CoreComponent)

    const mainElement = wrapper.findAll('main')
    expect(mainElement.length).toEqual(1)
    expect(wrapper.getComponent({ name: 'RouterView' }).exists()).toBeTruthy()
  })
})
