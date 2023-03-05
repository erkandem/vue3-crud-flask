import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import router from '@/router'

describe('App.vue', () => {
  it('mounts all three main components', async () => {
    await router.push('/')
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.getComponent({ name: 'HeaderComponent' }).exists()).toBeTruthy()
    expect(wrapper.getComponent({ name: 'CoreComponent' }).exists()).toBeTruthy()
    expect(wrapper.getComponent({ name: 'FooterComponent' }).exists()).toBeTruthy()
  })

  it('renders the home view', async () => {
    await router.push('/')
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.getComponent({ name: 'HomeComponent' }).exists()).toBeTruthy()
    expect(wrapper.find('h3').text()).toMatch('Le Home')
  })

  it('renders the ping view', async () => {
    await router.push('/ping')
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.getComponent({ name: 'PingComponent' }).exists()).toBeTruthy()
  })
  it('renders the books view', async () => {
    await router.push('/books')
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.getComponent({ name: 'BooksComponent' }).exists()).toBeTruthy()
  })
})
