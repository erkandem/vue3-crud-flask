import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import AddBookModal from '@/components/AddBookModal.vue'

describe('AddBookModal.vue', () => {
  it('renders as desired', () => {
    const wrapper = shallowMount(AddBookModal)
    // inspect the header
    const heading = wrapper.findAll('h3')
    expect(heading.length).toEqual(1)
    expect(heading[0].text()).toMatch('Add a Book')

    // check our labels and the order of the labels
    const label = wrapper.findAll('form label')
    expect(label.length).toBe(3)
    expect(label[0].text()).toMatch('Title:')
    expect(label[1].text()).toMatch('Author:')
    expect(label[2].text()).toMatch('Read?')

    // check that the form is clean and check the order of the input elements
    const inputs = wrapper.findAll('form input')
    expect(label.length).toBe(3)
    expect(inputs[0].element.value).toBe('')
    expect(inputs[1].element.value).toMatch('')
    expect(inputs[2].element.checked).not.toBeTruthy()

    // inspect the buttons to submit or cancel
    const buttons = wrapper.findAll('form button')
    expect(buttons.length).toEqual(2)
    expect(buttons[0].text()).toMatch('Submit')
    expect(buttons[1].text()).toMatch('Cancel')
  })
  it('handles a submit event via emit and includes the payload', async () => {
    const sampleFormData = {
      title: 'title',
      author: 'author',
      read: true
    }
    const wrapper = shallowMount(AddBookModal)
    await wrapper.find('#form-title-input').setValue(sampleFormData.title)
    await wrapper.find('#form-author-input').setValue(sampleFormData.author)
    await wrapper.find('#form-read-input').setChecked()

    await wrapper.find('#add-book-modal-submit-button').trigger('click')

    const emittedEvent = wrapper.emitted('submitAddBook')
    expect(emittedEvent).toHaveLength(1)
    expect(emittedEvent[0]).toEqual([sampleFormData])
  })
  it('handles a cancel button event', async () => {
    const wrapper = shallowMount(AddBookModal)

    await wrapper.find('#add-book-modal-cancel-button').trigger('click')
    const emittedEvent = wrapper.emitted('cancelAddBook')

    expect(emittedEvent).toHaveLength(1)
  })
  it('handles a cancel on the backdrop event', async () => {
    const wrapper = shallowMount(AddBookModal)

    await wrapper.find('.not-bootstrap-modal-backdrop').trigger('click')

    const emittedEvent = wrapper.emitted('cancelAddBook')
    expect(emittedEvent).toHaveLength(1)
  })
  it('clicking the modal core area does NOT trigger a reset', async () => {
    const wrapper = shallowMount(AddBookModal)

    await wrapper.find('.not-bootstrap-modal').trigger('click')

    const emittedEvent = wrapper.emitted('cancelAddBook')
    expect(emittedEvent).not.toBeTruthy()
  })
})
