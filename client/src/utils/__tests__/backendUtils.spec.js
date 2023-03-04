import { backendSchema } from '@/utils/backendUtils'
import { describe, it, expect } from 'vitest'

describe('backendUtils.js', () => {
  it('ping endpoint is composed correctly', () => {
    const expectation = backendSchema.baseUrl + backendSchema.pingEndpoint
    expect(backendSchema.getPingRouteURL()).toMatch(expectation)
  })
})
