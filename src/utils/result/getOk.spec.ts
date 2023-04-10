import { getOk } from './getOk'

describe('getOk', () => {
  it('returns a ok object', () => {
    const success = 1
    const result = getOk(success)
    expect(result.isOk()).toBeTruthy()
    expect(result.getValue()).toBe(success)
    expect(result.isError()).toBeFalsy()
    expect(result.getError()).toBeUndefined()
  })
})
