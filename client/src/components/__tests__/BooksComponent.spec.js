import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { backendSchema } from '@/utils/backendUtils'
import { constants, apiStatuses } from '@/utils/constants'
import BooksComponent from '@/components/BooksComponent.vue'

const rowsInTable = 4
let axiosMock = new MockAdapter(axios)

const sampleBooks = () => {
  return [
    {
      id: '1',
      title: 'title',
      author: 'name',
      read: true
    },
    {
      id: '2',
      title: 'title 2',
      author: 'name 2',
      read: false
    }
  ]
}
const getSampleBooksGetResponse = () => {
  // TODO: could be redone using faker;
  //        accept parameter of the number of books;
  return {
    status: 'success',
    books: sampleBooks()
  }
}

afterEach(() => {
  axiosMock.reset()
})

describe('BooksComponent.vue', () => {
  it('does a SUCCESSFUL call to the backend after mounting', async () => {
    const books = getSampleBooksGetResponse()
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, books)

    const wrapper = shallowMount(BooksComponent)
    await flushPromises()

    // inspect axios mock
    expect(axiosMock.history.get.length).toBe(1)
    expect(axiosMock.history.get[0].url).toMatch(backendSchema.getBooksRouteURL())
    expect(axiosMock.history.get[0].method).toBe('get')
    // check that the component variable stores the API result
    expect(wrapper.vm.books).toEqual(books.books)

    // assert that apiStatusMessage and apiStatus props for the alert subcomponent are set
    expect(wrapper.vm.apiStatusMessage).toMatch('')
    expect(wrapper.vm.apiStatus).toMatch(apiStatuses.neutral)

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

    // assert that apiStatusMessage and apiStatus props for the alert subcomponent are set
    expect(wrapper.vm.apiStatusMessage).toMatch(constants.failedGetAPIMessage)
    expect(wrapper.vm.apiStatus).toMatch(apiStatuses.error)

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

    // assert that apiStatusMessage and apiStatus props for the alert subcomponent are set
    expect(wrapper.vm.apiStatusMessage).toMatch(constants.networkFailedGetAPIMessage)
    expect(wrapper.vm.apiStatus).toMatch(apiStatuses.error)

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

    // assert that apiStatusMessage and apiStatus props for the alert subcomponent are set
    expect(wrapper.vm.apiStatusMessage).toMatch(constants.successfulPostApiMessage)
    expect(wrapper.vm.apiStatus).toMatch(apiStatuses.success)
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

    // assert that apiStatusMessage and apiStatus props for the alert subcomponent are set
    expect(wrapper.vm.apiStatusMessage).toMatch(constants.networkFailedPostApiMessage)
    expect(wrapper.vm.apiStatus).toMatch(apiStatuses.error)

    // expect alert class is set to            alert alert-danger
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

    // assert that apiStatusMessage and apiStatus props for the alert subcomponent are set
    expect(wrapper.vm.apiStatusMessage).toMatch(constants.failedPostApiMessage)
    expect(wrapper.vm.apiStatus).toMatch(apiStatuses.error)
  })
})

describe('BooksComponent.vue handles editing a book', () => {
  it('clicking the edit button loads the modal', async () => {
    const sampleBooksResponse = getSampleBooksGetResponse()
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, sampleBooksResponse)
    const bookToBeEditedIndex = 0
    const wrapper = shallowMount(BooksComponent)
    await flushPromises()
    const buttons = wrapper.findAll('tbody button')
    expect(buttons[bookToBeEditedIndex].text()).toMatch('Update')
    expect(wrapper.vm.showEditBookModal).toBe(false)

    await buttons[bookToBeEditedIndex].trigger('click')

    expect(wrapper.vm.bookBeingEdited).toEqual(sampleBooksResponse.books[bookToBeEditedIndex])
    expect(wrapper.vm.showEditBookModal).toBe(true)
  })
  it('handles a successful PUT request', async () => {
    const sampleBook = {
      id: '1',
      title: 'title',
      author: 'author',
      read: true
    }
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, {
      status: 'success',
      books: []
    })
    axiosMock.onPut(backendSchema.getBookEditRouteURL(sampleBook.id)).reply(200)
    const wrapper = shallowMount(BooksComponent)
    expect(axiosMock.history.get.length).toBe(1)

    wrapper.vm.updateBook(sampleBook)
    await flushPromises()

    // inspect the sent PUT request
    expect(axiosMock.history.put.length).toBe(1)
    expect(axiosMock.history.put[0].method).toMatch('put')
    expect(axiosMock.history.put[0].url).toMatch(backendSchema.getBookEditRouteURL(sampleBook.id))
    expect(JSON.parse(axiosMock.history.put[0].data)).toEqual(sampleBook)

    // inspect to the initial GET and consecutive post-PUT GET request
    expect(axiosMock.history.get.length).toBe(2)

    // assert that apiStatusMessage and apiStatus props for the alert subcomponent are set
    expect(wrapper.vm.apiStatusMessage).toMatch(constants.successfulPutApiMessage)
    expect(wrapper.vm.apiStatus).toMatch(apiStatuses.success)
  })

  it('handles a failed PUT request due to network issues', async () => {
    const sampleBook = {
      id: '1',
      title: 'title',
      author: 'author',
      read: true
    }
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, {
      status: 'success',
      books: []
    })
    axiosMock.onPut(backendSchema.getBookEditRouteURL(sampleBook.id)).networkError()

    const wrapper = shallowMount(BooksComponent)
    expect(axiosMock.history.get.length).toBe(1)

    wrapper.vm.updateBook(sampleBook)
    await flushPromises()

    // inspect the sent PUT request
    expect(axiosMock.history.put.length).toBe(1)
    expect(axiosMock.history.put[0].method).toMatch('put')
    expect(axiosMock.history.put[0].url).toMatch(backendSchema.getBookEditRouteURL(sampleBook.id))
    expect(JSON.parse(axiosMock.history.put[0].data)).toEqual(sampleBook)

    // inspect to the initial GET and consecutive post-PUT GET request
    expect(axiosMock.history.get.length).toBe(2)

    // assert that apiStatusMessage and apiStatus props for the alert subcomponent are set
    expect(wrapper.vm.apiStatusMessage).toMatch(constants.networkFailedPutApiMessage)
    expect(wrapper.vm.apiStatus).toMatch(apiStatuses.error)
  })
  it('handles a failed PUT request due to  4.. or 5.. ', async () => {
    const sampleBook = {
      id: '1',
      title: 'title',
      author: 'author',
      read: true
    }
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, {
      status: 'success',
      books: []
    })
    axiosMock.onPut(backendSchema.getBookEditRouteURL(sampleBook.id)).reply(404)

    const wrapper = shallowMount(BooksComponent)
    expect(axiosMock.history.get.length).toBe(1)

    wrapper.vm.updateBook(sampleBook)
    await flushPromises()

    // inspect the sent PUT request
    expect(axiosMock.history.put.length).toBe(1)
    expect(axiosMock.history.put[0].method).toMatch('put')
    expect(axiosMock.history.put[0].url).toMatch(backendSchema.getBookEditRouteURL(sampleBook.id))
    expect(JSON.parse(axiosMock.history.put[0].data)).toEqual(sampleBook)

    // inspect to the initial GET and consecutive post-PUT GET request
    expect(axiosMock.history.get.length).toBe(2)

    // assert that apiStatusMessage and apiStatus props for the alert subcomponent are set
    expect(wrapper.vm.apiStatusMessage).toMatch(constants.failedPutApiMessage)
    expect(wrapper.vm.apiStatus).toMatch(apiStatuses.error)
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
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, getSampleBooksGetResponse())
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
  it('handles a cancelEditBook event', () => {
    const wrapper = shallowMount(BooksComponent)
    wrapper.vm.showAddBookModal = true
    const initialFormState = { id: '1', author: 'a', title: 'b', read: true }
    const expectedFormState = {}
    wrapper.vm.bookBeingEdited = initialFormState

    wrapper.vm.cancelEditBookHandler()

    // check that the visibility is false
    expect(wrapper.vm.showEditBookModal).toBe(false)
    // check that the form dat was reset
    expect(wrapper.vm.bookBeingEdited).toEqual(expectedFormState)
  })
  it('handles a submitEditBook custom event', async () => {
    const initialFormState = { id: '1', author: 'a', title: 'b', read: true }
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, getSampleBooksGetResponse())
    axiosMock.onPut(backendSchema.getBookEditRouteURL(initialFormState.id)).reply(200)
    const wrapper = shallowMount(BooksComponent)
    wrapper.vm.showEditBookModal = true
    const probe = { test: true }
    const expectedFormState = {}
    wrapper.vm.bookBeingEdited = initialFormState

    wrapper.vm.submitEditBookHandler(probe)
    await flushPromises

    // check the side effect on the alert components props
    expect(wrapper.vm.showEditBookModal).toBe(false)
    // check that the edit form data is cleared
    expect(wrapper.vm.bookBeingEdited).toEqual(expectedFormState)
    // check that the payload reached the IO method and resulted in a PUT request
    expect(JSON.parse(axiosMock.history.put[0].data)).toEqual(probe)
  })
})

describe('BooksComponent.vue modal sub components', () => {
  beforeEach(() => {
    // generally mocking out the axios package bc we don't inspect the IO here
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, getSampleBooksGetResponse())
  })
  it('has a modal component to add a book', async () => {
    const wrapper = shallowMount(BooksComponent)
    wrapper.vm.showAddBookModal = true
    await flushPromises()

    expect(wrapper.getComponent({ name: 'AddBookModal' }).exists()).toBe(true)
    expect(wrapper.getComponent({ name: 'AddBookModal' }).exists()).toBe(true)
    expect(wrapper.getComponent({ name: 'AlertComponent' }).exists()).toBe(true)
  })
  it('hitting the "add book button" makes the modal visible', async () => {
    const wrapper = shallowMount(BooksComponent)
    expect(wrapper.vm.showAddBookModal).toBe(false)

    await wrapper.find('#add-book-button').trigger('click')

    expect(wrapper.vm.showAddBookModal).toBeTruthy()
    expect(wrapper.getComponent({ name: 'AddBookModal' }).isVisible()).toBe(true)
  })
})

describe('BooksComponent.vue alert sub component', () => {
  beforeEach(() => {
    // generally mocking out the axios package bc we don't inspect the IO here
    axiosMock.onGet(backendSchema.getBooksRouteURL()).reply(200, getSampleBooksGetResponse())
  })
  it('emitted dismissal call resets status and message', async () => {
    const wrapper = shallowMount(BooksComponent)
    wrapper.vm.apiStatusMessage = 'message'
    wrapper.vm.apiStatus = 'status'

    wrapper.vm.dismissAlertHandler()

    expect(wrapper.vm.apiStatusMessage).toBe('')
    expect(wrapper.vm.apiStatus).toBe('')
  })
})
