import { shouldGoToContract } from '../../../../src/views/search/shouldGoToContract'

describe('shouldGoToContract', () => {
  it('should return true if the error has a contractId in the details', () => {
    const error: APIError = {
      error: 'message',
      details: {
        contractId: 'contractId',
      },
    }
    const result = shouldGoToContract(error)
    expect(result).toBe(true)
  })

  it('should return false if the error does not have a contractId in the details', () => {
    const error: APIError = {
      error: 'message',
      details: {},
    }
    const result = shouldGoToContract(error)
    expect(result).toBe(false)
  })

  it('should return false if details is not an object', () => {
    const error: APIError = {
      error: 'message',
      details: 'details',
    }
    const result = shouldGoToContract(error)
    expect(result).toBe(false)
  })

  it('should return false if the error does not have details', () => {
    const error: APIError = {
      error: 'message',
    }
    const result = shouldGoToContract(error)
    expect(result).toBe(false)
  })
})
