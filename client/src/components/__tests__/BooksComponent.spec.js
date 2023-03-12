import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { backendSchema } from '@/utils/backendUtils'
import { constants } from '@/utils/constants'
import BooksComponent from '@/components/BooksComponent.vue'

const rowsInTable = 4
let axiosMock = new MockAdapter(axios)

const bookGetResponseMock = () => {
  // TODO: could be redone using faker;
  //        accept parameter of the number of books;
  return {
    status: 'success',
    books: [
      {
        title: 'title',
        author: 'name',
        read: true
      },
      {
        title: 'title 2',
        author: 'name 2',
        read: false
      }
    ]
  }
}

afterEach(() => {
  axiosMock.reset()
})

describe('BooksComponent.vue', () => {
  it('does a SUCCESSFUL call to the backend after mounting', async () => {
    const books = bookGetResponseMock()
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, books)

    const wrapper = shallowMount(BooksComponent)
    await flushPromises()

    // inspect axios mock
    expect(axiosMock.history.get.length).toBe(1)
    expect(axiosMock.history.get[0].url).toMatch(backendSchema.getBooksRouteURL())
    expect(axiosMock.history.get[0].method).toBe('get')
    // check that the component variable stores the API result
    expect(wrapper.vm.books).toEqual(books.books)

    // check that the status container is empty
    expect(wrapper.find('#books-api-response-status').text()).toMatch('')

    // inspect rendering of the API result
    expect(wrapper.findAll('tr').length).toBe(1 + books.books.length)
    const td = wrapper.findAll('td')
    expect(td.length).toBe(rowsInTable * books.books.length)
    expect(td[0].text()).toBe(books.books[0].title)
    expect(td[1].text()).toBe(books.books[0].author)
    expect(td[2].text()).toBe(books.books[0].read ? constants.yesString : constants.noString)
    // check the else branch
    expect(td[6].text()).toBe(books.books[1].read ? constants.yesString : constants.noString)

    // inspect buttons in last column
    const buttons = wrapper.findAll('tbody button')
    expect(buttons.length).toBe(2 * books.books.length)
    expect(buttons[0].text()).toMatch('Update')
    expect(buttons[1].text()).toMatch('Delete')
    expect(buttons[2].text()).toMatch('Update')
    expect(buttons[3].text()).toMatch('Delete')
  })
  it('does a FAILED call to the backend after mounting', async () => {
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(404)

    const wrapper = shallowMount(BooksComponent)
    await flushPromises()

    // inspect axios mock
    expect(axiosMock.history.get.length).toBe(1)
    expect(axiosMock.history.get[0].url).toMatch(backendSchema.getBooksRouteURL())
    expect(axiosMock.history.get[0].method).toBe('get')

    // check that the component variable stores the API result
    expect(wrapper.vm.books).toEqual([])

    // check that the status container is pointing out an error
    expect(wrapper.find('#books-api-response-status').text()).toMatch(constants.failedGetAPIMessage)

    // inspect the rendering of the API result
    expect(wrapper.findAll('tr').length).toBe(1) // only table header
    const td = wrapper.findAll('td')
    expect(td.length).toBe(0)

    // inspect buttons in table
    const buttons = wrapper.findAll('table button')
    expect(buttons.length).toBe(0)
  })
  it('does a FAILED call to the backend after mounting because of NETWORK issues', async () => {
    axiosMock.onGet(backendSchema.getBooksRouteURL()).networkError()

    const wrapper = shallowMount(BooksComponent)
    await flushPromises()

    // inspect axios mock
    expect(axiosMock.history.get.length).toBe(1)
    expect(axiosMock.history.get[0].url).toMatch(backendSchema.getBooksRouteURL())
    expect(axiosMock.history.get[0].method).toBe('get')

    // check that the component variable stores the API result
    expect(wrapper.vm.books).toEqual([])

    // check that the status container is pointing out an error
    expect(wrapper.find('#books-api-response-status').text()).toMatch(
      constants.networkFailedGetAPIMessage
    )

    // inspect the rendering of the API result
    expect(wrapper.findAll('tr').length).toBe(1) // only table header
    const td = wrapper.findAll('td')
    expect(td.length).toBe(0)

    // inspect buttons in table
    const buttons = wrapper.findAll('table button')
    expect(buttons.length).toBe(0)
  })
})

describe('BooksComponent.vue on POST', () => {
  it('submit user data successfully', async () => {
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, {
      status: 'success',
      books: []
    })
    axiosMock.onPost(backendSchema.getBooksRouteURL()).reply(200, { status: 'success' })
    const sampleBook = {
      title: 'title',
      author: 'author',
      read: true
    }
    const wrapper = shallowMount(BooksComponent)
    expect(axiosMock.history.get.length).toBe(1)

    wrapper.vm.addBook(sampleBook)
    await flushPromises()

    // inspect the post request we expect to be done
    expect(axiosMock.history.post.length).toBe(1)
    expect(axiosMock.history.post[0].method).toMatch('post')
    expect(axiosMock.history.post[0].url).toMatch(backendSchema.getBooksRouteURL())
    expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(sampleBook)

    // inspect to the initial and consecutive get request
    expect(axiosMock.history.get.length).toBe(2)
    // check side effect on the span
    expect(wrapper.find('#books-api-response-status').text()).toMatch(
      constants.successfulPostApiMessage
    )
  })
  it('submit user data FAILS due to network', async () => {
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, {
      status: 'success',
      books: []
    })
    axiosMock.onPost(backendSchema.getBooksRouteURL()).networkError()
    const sampleBook = {
      title: 'title',
      author: 'author',
      read: true
    }
    const wrapper = shallowMount(BooksComponent)
    expect(axiosMock.history.get.length).toBe(1)

    wrapper.vm.addBook(sampleBook)
    await flushPromises()

    // inspect the post request we expect to be done
    expect(axiosMock.history.post.length).toBe(1)
    expect(axiosMock.history.post[0].method).toMatch('post')
    expect(axiosMock.history.post[0].url).toMatch(backendSchema.getBooksRouteURL())
    expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(sampleBook)

    // inspect to the initial and consecutive get request
    expect(axiosMock.history.get.length).toBe(2)

    // check side effect on the span
    expect(wrapper.find('#books-api-response-status').text()).toMatch(
      constants.networkFailedPostApiMessage
    )
  })
  it('submit user data FAILS due to  4.. or 5.. ', async () => {
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, {
      status: 'success',
      books: []
    })
    axiosMock.onPost(backendSchema.getBooksRouteURL()).reply(404)
    const sampleBook = {
      title: 'title',
      author: 'author',
      read: true
    }
    const wrapper = shallowMount(BooksComponent)
    expect(axiosMock.history.get.length).toBe(1)

    wrapper.vm.addBook(sampleBook)
    await flushPromises()

    // inspect the post request we expect to be done
    expect(axiosMock.history.post.length).toBe(1)
    expect(axiosMock.history.post[0].method).toMatch('post')
    expect(axiosMock.history.post[0].url).toMatch(backendSchema.getBooksRouteURL())
    expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(sampleBook)

    // inspect to the initial and consecutive get request
    expect(axiosMock.history.get.length).toBe(2)

    // check side effect on the span
    expect(wrapper.find('#books-api-response-status').text()).toMatch(
      constants.failedPostApiMessage
    )
  })
})

describe('BooksComponent.vue emit handlers', () => {
  it('handle a cancel event', () => {
    const wrapper = shallowMount(BooksComponent)
    wrapper.vm.showAddBookModal = true

    wrapper.vm.cancelAddBook()

    expect(wrapper.vm.showAddBookModal).toBe(false)
  })
  it('handles a submitAddBook emit', () => {
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, bookGetResponseMock())
    axiosMock.onPost(backendSchema.getBooksRouteURL()).reply(200)
    const wrapper = shallowMount(BooksComponent)
    wrapper.vm.showAddBookModal = true
    const probe = { test: true }

    wrapper.vm.submitAddBook(probe)

    // check that the side effect was triggered
    expect(wrapper.vm.showAddBookModal).toBe(false)
    // check that the payload reached the IO method and resulted in a POST request
    expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(probe)
  })
})

describe('BooksComponent.vue modal sub component', () => {
  beforeEach(() => {
    // generally mocking out the axios package bc we don't inspect the IO here
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, bookGetResponseMock())
  })
  it('has a modal component to add a book', async () => {
    const wrapper = shallowMount(BooksComponent)
    wrapper.vm.showAddBookModal = true
    await flushPromises()

    expect(wrapper.getComponent({ name: 'AddBookModal' }).exists()).toBe(true)
  })
  it('hitting the "add book button" makes the modal visible', async () => {
    const wrapper = shallowMount(BooksComponent)
    expect(wrapper.vm.showAddBookModal).toBe(false)

    await wrapper.find('#add-book-button').trigger('click')

    expect(wrapper.vm.showAddBookModal).toBeTruthy()
    expect(wrapper.getComponent({ name: 'AddBookModal' }).isVisible()).toBe(true)
  })
})
