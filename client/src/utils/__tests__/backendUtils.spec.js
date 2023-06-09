import { backendSchema } from '@/utils/backendUtils'
import { describe, it, expect, expectTypeOf } from 'vitest'

describe('backendUtils.js', () => {
  it('ping endpoint is composed correctly', () => {
    const expectation = backendSchema.baseUrl + backendSchema.pingEndpoint
    expectTypeOf(expectation).toBeString()
    expect(backendSchema.getPingRouteURL()).toMatch(expectation)
  })
  it('books endpoint is composed correctly', () => {
    const expectation = backendSchema.baseUrl + backendSchema.booksEndpoint
    expectTypeOf(expectation).toBeString()
    expect(backendSchema.getBooksRouteURL()).toMatch(expectation)
  })

  it('individual book endpoint is composed correctly', () => {
    const bookId = '15'
    const expectation = backendSchema.baseUrl + backendSchema.booksEndpoint + '/' + bookId
    expectTypeOf(expectation).toBeString()
    expect(backendSchema.getBookEditRouteURL(bookId)).toMatch(expectation)
  })
})
