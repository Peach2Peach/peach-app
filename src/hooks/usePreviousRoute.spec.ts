import { renderHook } from 'test-utils'
import { usePreviousRoute } from './usePreviousRoute'

jest.mock('./useNavigation', () => ({
  useNavigation: () => ({
    getState: () => ({
      routes: [{ name: 'First' }, { name: 'Second' }, { name: 'Third' }],
    }),
  }),
}))

describe('usePreviousRoute', () => {
  it('should return the name of the previous route', () => {
    const { result } = renderHook(usePreviousRoute)
    expect(result.current).toEqual({ name: 'Second' })
  })
})
