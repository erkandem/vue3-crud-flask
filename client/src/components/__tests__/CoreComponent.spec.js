import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { describe, it, expect } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import CoreComponent from '@/components/CoreComponent.vue'
import { backendSchema } from '@/utils/backendUtils'

let axiosMock = new MockAdapter(axios)

describe('CoreComponent.vue', () => {
  it('renders the header message', async () => {
    const getTestResponse = () => {
      return { message: 'pong!!!' }
    }
    axiosMock.onGet(backendSchema.getPingRouteURL()).reply(200, getTestResponse())

    const wrapper = shallowMount(CoreComponent)
    await flushPromises()

    // assertions on the static part
    const header = wrapper.findAll('main')
    expect(header.length).toEqual(1)
    expect(header[0].text()).toMatch('Le Content')
    // assertions on the API part
    expect(axiosMock.history.get.length).toEqual(1)
    expect(axiosMock.history.get[0].method).toMatch('get')
    expect(axiosMock.history.get[0].url).toMatch(backendSchema.getPingRouteURL())
    expect(wrapper.find('#ping-response').text()).toMatch(getTestResponse().message)
    axiosMock.reset()
  })
})
