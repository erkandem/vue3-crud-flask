import { describe, it, expect, flushPromises, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { backendSchema } from '@/utils/backendUtils'
import { constants } from '@/utils/constants'
import BooksComponent from '@/components/BooksComponent.vue'

const rowsInTable = 4

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
      }
    ]
  }
}

describe('BooksComponent.vue', () => {
  let axiosMock = new MockAdapter(axios)

  afterEach(() => {
    axiosMock.reset()
  })
  it('static renders the component', () => {
    const wrapper = shallowMount(BooksComponent)
    const th = wrapper.findAll('th')
    expect(th.length).toBe(4)
    expect(th[0].text()).toMatch('Title')
    expect(th[1].text()).toMatch('Author')
    expect(th[2].text()).toMatch('Read')
    expect(th[3].text()).toMatch('')
  })
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
    expect(wrapper.vm.books.value).equals(books)

    // check that the status container is empty
    expect(wrapper.find('#books-api-response-status').text()).toMatch('')

    // inspect rendering of the API result
    expect(wrapper.findAll('tr').length).toBe(1 + books.books.length)
    const td = wrapper.findAll('td')
    expect(td.length).toBe(rowsInTable * books.books.length)
    expect(td[0].text()).toBe(books.books[0].title)
    expect(td[1].text()).toBe(books.books[0].author)
    expect(td[2].text()).toBe(books.books[0].read ? constants.yesString : constants.noString)
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
    expect(wrapper.vm.books.value).equals([])

    // check that the status container is pointing out an error
    expect(wrapper.find('#books-api-response-status').text()).toMatch(constants.failedAPIMessage)

    // inspect the rendering of the API result
    expect(wrapper.findAll('tr').length).toBe(1) // only table header
    const td = wrapper.findAll('td')
    expect(td.length).toBe(0)
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
    expect(wrapper.vm.books.value).equals([])

    // check that the status container is pointing out an error
    expect(wrapper.find('#books-api-response-status').text()).toMatch(
      constants.networkFailedAPIMessage
    )

    // inspect the rendering of the API result
    expect(wrapper.findAll('tr').length).toBe(1) // only table header
    const td = wrapper.findAll('td')
    expect(td.length).toBe(0)
  })
})
