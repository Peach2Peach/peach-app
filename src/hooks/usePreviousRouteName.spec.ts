import { renderHook } from 'test-utils'
import { usePreviousRouteName } from './usePreviousRouteName'

jest.mock('./useNavigation', () => ({
  useNavigation: () => ({
    getState: () => ({
      routes: [{ name: 'First' }, { name: 'Second' }, { name: 'Third' }],
    }),
  }),
}))

describe('usePreviousRouteName', () => {
  it('should return the name of the previous route', () => {
    const { result } = renderHook(usePreviousRouteName)
    expect(result.current).toEqual('Second')
  })
})
