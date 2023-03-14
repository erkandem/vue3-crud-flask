import { describe, it, expect } from 'vitest'
import AlertComponent from '@/components/AlertComponent.vue'
import { shallowMount } from '@vue/test-utils'
import { bootStrapAlertClasses, apiStatuses } from '@/utils/constants'

describe('AlertComponent.vue', () => {
  it('renders a success message', () => {
    const testMessage = {
      alertStatus: apiStatuses.success,
      alertMessage: 'Got everything I we need from the API'
    }
    const wrapper = shallowMount(AlertComponent, {
      propsData: {
        alertStatus: testMessage.alertStatus,
        alertMessage: testMessage.alertMessage
      }
    })
    expect(wrapper.text()).toMatch(testMessage.alertMessage)
    expect(wrapper.findAll('.alert-wrapper').length).toBe(1)
    expect(wrapper.findAll('.alert-wrapper')[0].findAll('div').length).toBe(1)
    // we have set the classes which bootstrap expects
    expect(wrapper.find('.alert-wrapper > div').classes()).toContain(bootStrapAlertClasses.success)
    expect(wrapper.find('.alert-wrapper > div').classes()).toContain(bootStrapAlertClasses.alert)
  })

  it('renders a danger message', () => {
    const testMessage = {
      alertStatus: apiStatuses.error,
      alertMessage: 'Kerosin leakage detected'
    }
    const wrapper = shallowMount(AlertComponent, {
      propsData: {
        alertStatus: testMessage.alertStatus,
        alertMessage: testMessage.alertMessage
      }
    })
    expect(wrapper.text()).toMatch(testMessage.alertMessage)
    expect(wrapper.findAll('.alert-wrapper').length).toBe(1)
    expect(wrapper.findAll('.alert-wrapper')[0].findAll('div').length).toBe(1)
    // we have set the classes which bootstrap expects
    expect(wrapper.find('.alert-wrapper > div').classes()).toContain(bootStrapAlertClasses.error)
    expect(wrapper.find('.alert-wrapper > div').classes()).toContain(bootStrapAlertClasses.alert)
  })
  it('renders a neutral message without any style', () => {
    const testMessage = {
      alertStatus: apiStatuses.neutral,
      alertMessage: 'Nothing specific'
    }
    const wrapper = shallowMount(AlertComponent, {
      props: {
        alertStatus: testMessage.alertStatus,
        alertMessage: testMessage.alertMessage
      }
    })
    expect(wrapper.text()).toMatch(testMessage.alertMessage)
    expect(wrapper.findAll('.alert-wrapper').length).toBe(1)
    expect(wrapper.findAll('.alert-wrapper')[0].findAll('div').length).toBe(1)

    expect(wrapper.find('.alert-wrapper > div').classes()).toEqual([])
  })
  it('renders a neutral message without any style when ask for something undefined', () => {
    const testMessage = {
      alertStatus: 'definetlyNotPropertyOfOurBootStrapClass',
      alertMessage: ''
    }
    expect(Object.prototype.hasOwnProperty.call(apiStatuses, testMessage.alertStatus)).not
      .toBeTruthy
    const wrapper = shallowMount(AlertComponent, {
      props: {
        alertStatus: testMessage.alertStatus,
        alertMessage: testMessage.alertMessage
      }
    })

    // our message is stell rendered
    expect(wrapper.text()).toMatch(testMessage.alertMessage)
    expect(wrapper.findAll('.alert-wrapper').length).toBe(1)
    expect(wrapper.findAll('.alert-wrapper')[0].findAll('div').length).toBe(1)
    // we left the classes empty, so bootstrap is not rendering an alert component
    expect(wrapper.find('.alert-wrapper > div').classes()).toEqual([])
  })

  it('is dismissible', async () => {
    const testMessage = {
      alertStatus: apiStatuses.error,
      alertMessage: 'The earth got flattened'
    }
    const wrapper = shallowMount(AlertComponent, {
      props: {
        alertStatus: testMessage.alertStatus,
        alertMessage: testMessage.alertMessage
      }
    })

    // our message is rendered
    expect(wrapper.text()).toMatch(testMessage.alertMessage)
    expect(wrapper.findAll('.alert-wrapper').length).toBe(1)
    expect(wrapper.findAll('.alert-wrapper')[0].findAll('div').length).toBe(1)
    // we have set the classes which bootstrap expects
    expect(wrapper.find('.alert-wrapper > div').classes()).toContain(bootStrapAlertClasses.error)
    expect(wrapper.find('.alert-wrapper > div').classes()).toContain(bootStrapAlertClasses.alert)
    // the style is not defined, so we leave the classes empty

    expect(wrapper.findAll('button').length).toBe(1)
    await wrapper.find('button').trigger('click')

    const emittedEvent = wrapper.emitted('dismissAlert')
    expect(emittedEvent).toHaveLength(1)
  })
})
