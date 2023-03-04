import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../App.vue'

describe('App.vue', () => {
  it('mounts all three main components', () => {
    const wrapper = mount(App)
    expect(wrapper.getComponent({ name: 'HeaderComponent' }).exists()).toBeTruthy()
    expect(wrapper.getComponent({ name: 'CoreComponent' }).exists()).toBeTruthy()
    expect(wrapper.getComponent({ name: 'FooterComponent' }).exists()).toBeTruthy()
  })
})
