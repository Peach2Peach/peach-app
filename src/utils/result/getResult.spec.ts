import { getResult } from './getResult'

describe('getResult', () => {
  it('returns as error by default', () => {
    const result = getResult()
    expect(result.isOk()).toBeFalsy()
    expect(result.getValue()).toBeUndefined()
    expect(result.isError()).toBeTruthy()
    expect(result.getError()).toBeUndefined()
  })
  it('returns a success result object', () => {
    const success = 1
    const result = getResult(success)
    expect(result.isOk()).toBeTruthy()
    expect(result.getValue()).toBe(success)
    expect(result.isError()).toBeFalsy()
    expect(result.getError()).toBeUndefined()
  })
  it('returns an error result object', () => {
    const success = undefined
    const error = new Error()
    const result = getResult(success, error)
    expect(result.isOk()).toBeFalsy()
    expect(result.getValue()).toBeUndefined()
    expect(result.isError()).toBeTruthy()
    expect(result.getError()).toBe(error)
  })

  it('indicates that it is not ok when there is an error even if there is a result', () => {
    const success = 1
    const error = new Error()
    const result = getResult(success, error)
    expect(result.isOk()).toBeFalsy()
    expect(result.isError()).toBeTruthy()
  })
})
