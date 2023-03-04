export const backendSchema = {
  baseUrl: 'http://localhost:5000/',
  pingEndpoint: 'ping',
  getPingRouteURL() {
    return this.baseUrl + this.pingEndpoint
  }
}
