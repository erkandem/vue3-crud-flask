export const backendSchema = {
  baseUrl: 'http://localhost:5000/',
  pingEndpoint: 'ping',
  booksEndpoint: 'books',
  getPingRouteURL() {
    return this.baseUrl + this.pingEndpoint
  },
  getBooksRouteURL() {
    return this.baseUrl + this.booksEndpoint
  },
  getBookEditRouteURL(bookId) {
    return `${this.baseUrl}${this.booksEndpoint}/${bookId}`
  }
}
