import { describe, it, expect } from 'vitest'
import AlertComponent from 'AlertComponent.vue'
import { shallowMount } from '@vue/testutils'
import { bootStrapAlertClasses } from '@/utils/constants'

describe('AlertComponent.vue', () => {
  it('renders a success message', () => {
    const testMessage = {
      status: bootStrapAlertClasses.success,
      message: 'Got everything I we need from the API'
    }
    const wrapper = shallowMount(AlertComponent, {
      props: {
        status: testMessage.status,
        message: testMessage.message
      }
    })
    expect(wrapper.text()).toMatch(testMessage.message)
    const alertDivs = wrapper.findAll('.alert')
    expect(alertDivs.length).toBe(1)
    expect(alertDivs[0].classes()).toContain(bootStrapAlertClasses.success)
  })

  it('renders a danger message', () => {
    const testMessage = {
      status: bootStrapAlertClasses.danger,
      message: 'Kerosin leakage detected'
    }
    const wrapper = shallowMount(AlertComponent, {
      props: {
        status: testMessage.status,
        message: 'Kerosin leakage detected'
      }
    })
    expect(wrapper.text()).toMatch(testMessage.message)
    const alertDivs = wrapper.findAll('.alert')
    expect(alertDivs.length).toBe(1)
    expect(alertDivs[0].classes()).toContain(bootStrapAlertClasses.danger)
  })
})
