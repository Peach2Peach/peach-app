import { shouldGoToContract } from './shouldGoToContract'

describe('shouldGoToContract', () => {
  it('should return true if contractId is present and isChat is false', () => {
    const data = { contractId: '123', isChat: 'false' }
    expect(shouldGoToContract(data)).toBe(true)
  })

  it('should return false if contractId is not present', () => {
    const data = { isChat: 'false' }
    expect(shouldGoToContract(data)).toBe(false)
  })

  it('should return false if isChat is true', () => {
    const data = { contractId: '123', isChat: 'true' }
    expect(shouldGoToContract(data)).toBe(false)
  })
})
