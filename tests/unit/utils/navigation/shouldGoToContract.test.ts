import { shouldGoToContract } from '../../../../src/utils/navigation/shouldGoToContract'

describe('shouldGoToContract', () => {
  it('should return true if contractId is present and isChat is false', () => {
    const remoteMessage = {
      data: {
        contractId: '123',
        isChat: 'false',
      },
    }

    expect(shouldGoToContract(remoteMessage)).toBe(true)
  })

  it('should return false if contractId is not present', () => {
    const remoteMessage = {
      data: {
        isChat: 'false',
      },
    }

    expect(shouldGoToContract(remoteMessage)).toBe(false)
  })

  it('should return false if isChat is true', () => {
    const remoteMessage = {
      data: {
        contractId: '123',
        isChat: 'true',
      },
    }

    expect(shouldGoToContract(remoteMessage)).toBe(false)
  })
})
