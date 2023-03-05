import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import router from '@/router'
import HeaderComponent from '@/components/HeaderComponent.vue'

describe('HeaderComponent.vue', () => {
  it('renders the header message', async () => {
    await router.push('/')
    const wrapper = mount(HeaderComponent, {
      global: {
        plugins: [router]
      }
    })
    const header = wrapper.findAll('header')
    expect(header.length).toEqual(1)
    expect(header[0].text()).toMatch('Le Header')
    // inspect rendering of RouterLinks
    const navLinks = wrapper.findAll('nav  a')
    expect(navLinks.length).toEqual(2)
    // inspect the home anchor
    expect(navLinks[0].attributes().href).toBe('/')
    expect(navLinks[0].text()).toMatch('Home')
    // inspect the ping anchor
    expect(navLinks[1].attributes().href).toBe('/ping')
    expect(navLinks[1].text()).toMatch('Ping')
  })
})
