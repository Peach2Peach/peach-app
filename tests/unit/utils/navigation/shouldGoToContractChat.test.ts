import { shouldGoToContractChat } from '../../../../src/utils/navigation/shouldGoToContractChat'

describe('shouldGoToContractChat', () => {
  it('should return true if contractId is present and isChat is true', () => {
    const remoteMessage = {
      data: {
        contractId: '123',
        isChat: 'true',
      },
    }

    expect(shouldGoToContractChat(remoteMessage)).toBe(true)
  })

  it('should return false if contractId is not present', () => {
    const remoteMessage = {
      data: {
        isChat: 'true',
      },
    }

    expect(shouldGoToContractChat(remoteMessage)).toBe(false)
  })

  it('should return false if isChat is false', () => {
    const remoteMessage = {
      data: {
        contractId: '123',
        isChat: 'false',
      },
    }

    expect(shouldGoToContractChat(remoteMessage)).toBe(false)
  })
})
