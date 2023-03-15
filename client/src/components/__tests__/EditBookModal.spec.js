import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import EditBookModal from '@/componentns/EditBookModal.vue'

describe('EditBookModal.vue', () => {
  it('is rendering the edit form', () => {
    const sampleBook = {
      id: 'some id',
      author: 'some author',
      title: 'some title',
      read: true
    }
    const wrapper = shallowMount(EditBookModal, {
      propsData: {
        bookToBeEdited: sampleBook
      }
    })

    // check the title
    const h3s = wrapper.findAll('h3')
    expect(h3s.length).toBe(1)
    expect(h3s[0].text()).toMatch('Edit a book')

    // check our labels and the order of the labels (implicitly)
    const label = wrapper.findAll('form label')
    expect(label.length).toBe(3)
    expect(label[0].text()).toMatch('Title:')
    expect(label[1].text()).toMatch('Author:')
    expect(label[2].text()).toMatch('Read?')

    // check that the form is initialized with our input values and
    // implicitly check the order of the input elements
    const inputs = wrapper.findAll('form input')
    expect(inputs.length).toBe(3)
    expect(inputs[0].element.value).toBe(sampleBook.author)
    expect(inputs[1].element.value).toMatch(sampleBook.title)
    expect(inputs[2].element.checked).toBeTruthy()

    // inspect the buttons
    const buttons = wrapper.findAll('buttons')
    expect(buttons.length).toBe(2)
    expect(buttons[0].text()).toMatch('Update')
    expect(buttons[1].text()).toMatch('Cancel')
  })
})

describe('EditBookModal.vue dynamic', () => {
  // Had tests here to check if the inputs have been cleared
  // but that is handled by the `v-if` statement which tears down the component
  // depending on the truthiness of `showEditBookModal`
  it('handles a submit click event', async () => {
    const sampleBook = {
      id: 'some id',
      author: 'some author',
      title: 'some title',
      read: true
    }
    const editedTitle = 'edited title'
    const editPayloadExpectation = Object.assign({}, sampleBook)

    const wrapper = shallowMount(EditBookModal, {
      propsData: {
        bookToBeEdited: sampleBook
      }
    })

    await wrapper.find('#form-title-input').setValue(editedTitle)
    wrapper.find('#edit-book-modal-submit-button').trigger('click')

    // inspect the custom event
    expect(wrapper.emitted('submitEditBook')).toBeTruthy()
    expect(wrapper.emitted('submitEditBook').length).toBe(1)
    expect(wrapper.emitted('submitEditBook')[0]).toEqual(editPayloadExpectation)
  })
  it('handles a cancel button click event', async () => {
    const sampleBook = {
      id: 'some id',
      author: 'some author',
      title: 'some title',
      read: true
    }
    const wrapper = shallowMount(EditBookModal, {
      propsData: {
        bookToBeEdited: sampleBook
      }
    })
    await wrapper.find('#edit-book-modal-cancel-button').trigger('click')

    // inspect the custom event
    expect(wrapper.emitted('cancelEditBook')).toBeTruthy()
    expect(wrapper.emitted('cancelEditBook').length).toBe(1)
  })
  it('handles a click on the backdrop', async () => {
    const sampleBook = {
      id: 'some id',
      author: 'some author',
      title: 'some title',
      read: true
    }
    const wrapper = shallowMount(EditBookModal, {
      propsData: {
        bookToBeEdited: sampleBook
      }
    })
    await wrapper.find('.not-bootstrap-modal-backdrop').trigger('click')

    // inspect the custom event
    expect(wrapper.emitted('cancelEditBook')).toBeTruthy()
    expect(wrapper.emitted('cancelEditBook').length).toBe(1)
  })
  it('does not emit a cancel on a click on the core area of the  modal', async () => {
    const sampleBook = {
      id: 'some id',
      author: 'some author',
      title: 'some title',
      read: true
    }
    const wrapper = shallowMount(EditBookModal, {
      propsData: {
        bookToBeEdited: sampleBook
      }
    })
    await wrapper.find('.not-bootstrap-modal').trigger('click')

    // inspect the custom event
    expect(wrapper.emitted('cancelEditBook')).not.toBeTruthy()
  })
})
