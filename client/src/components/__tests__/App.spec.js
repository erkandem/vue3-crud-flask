import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import router from '@/router'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { backendSchema } from '@/utils/backendUtils'

let axiosMock = new MockAdapter(axios)

afterEach(() => {
  axiosMock.reset()
})

describe('App.vue', () => {
  it('mounts all three main components', async () => {
    await router.push('/')
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.getComponent({ name: 'HeaderComponent' }).exists()).toBeTruthy()
    expect(wrapper.getComponent({ name: 'RouterView' }).exists()).toBeTruthy()
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
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, { status: 'success', books: [] })
    await router.push('/books')
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    expect(wrapper.getComponent({ name: 'BooksComponent' }).exists()).toBeTruthy()
  })
})
