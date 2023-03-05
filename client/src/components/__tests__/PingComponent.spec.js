import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, it, expect } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import PingComponent from '@/components/PingComponent.vue'
import { backendSchema } from '@/utils/backendUtils'

let axiosMock = new MockAdapter(axios)

describe('PingComponent.vue', () => {
  it('renders the response of a SUCCESSFUL ping request', async () => {
    const getTestResponse = () => {
      return { message: 'pong!!!' }
    }
    axiosMock.onGet(backendSchema.getPingRouteURL()).reply(200, getTestResponse())

    const wrapper = shallowMount(PingComponent)
    await flushPromises()

    // assertions on the API part
    expect(axiosMock.history.get.length).toEqual(1)
    expect(axiosMock.history.get[0].method).toMatch('get')
    expect(axiosMock.history.get[0].url).toMatch(backendSchema.getPingRouteURL())
    expect(wrapper.find('#ping-response').text()).toMatch(getTestResponse().message)
    axiosMock.reset()
  })

  it('renders the response of a FAILED ping request', async () => {
    axiosMock.onGet(backendSchema.getPingRouteURL()).reply(404)

    const wrapper = shallowMount(PingComponent)
    await flushPromises()

    // assertions on the API part
    expect(axiosMock.history.get.length).toEqual(1)
    expect(axiosMock.history.get[0].method).toMatch('get')
    expect(axiosMock.history.get[0].url).toMatch(backendSchema.getPingRouteURL())
    expect(wrapper.find('#ping-response').text()).toMatch('We are sorry. Something went wrong')
    axiosMock.reset()
  })

  it('renders the response of a FAILED ping request due to NETWORK', async () => {
    axiosMock.onGet(backendSchema.getPingRouteURL()).networkError()

    const wrapper = shallowMount(PingComponent)
    await flushPromises()

    // assertions on the API part
    expect(axiosMock.history.get.length).toEqual(1)
    expect(axiosMock.history.get[0].method).toMatch('get')
    expect(axiosMock.history.get[0].url).toMatch(backendSchema.getPingRouteURL())
    expect(wrapper.find('#ping-response').text()).toMatch('Is the backend running at http')
    axiosMock.reset()
  })
})
