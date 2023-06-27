import { QueryClient } from '@tanstack/react-query'
import { queryClient } from './queryClient'

describe('queryClient', () => {
  it('should be defined', () => {
    expect(queryClient).toBeInstanceOf(QueryClient)
  })
})
