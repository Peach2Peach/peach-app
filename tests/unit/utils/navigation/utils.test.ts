import {
  shouldGoToContract,
  shouldGoToContractChat,
  shouldGoToOffer,
  shouldGoToYourTradesSell,
  shouldGoToSearch,
  shouldGoToSell,
} from '../../../../src/utils/navigation/utils'

describe('shouldGoToContract', () => {
  it('should return true when contractId is present and isChat is not true', () => {
    const remoteMessage = {
      data: {
        contractId: '123',
        isChat: 'false',
      },
    }

    expect(shouldGoToContract(remoteMessage)).toBe(true)
  })

  it('should return false when contractId is not present', () => {
    const remoteMessage = {
      data: {
        isChat: 'false',
      },
    }

    expect(shouldGoToContract(remoteMessage)).toBe(false)
  })

  it('should return false when isChat is true', () => {
    const remoteMessage = {
      data: {
        contractId: '123',
        isChat: 'true',
      },
    }

    expect(shouldGoToContract(remoteMessage)).toBe(false)
  })
})

describe('shouldGoToContractChat', () => {
  it('should return true when contractId is present and isChat is true', () => {
    const remoteMessage = {
      data: {
        contractId: '123',
        isChat: 'true',
      },
    }

    expect(shouldGoToContractChat(remoteMessage)).toBe(true)
  })

  it('should return false when contractId is not present', () => {
    const remoteMessage = {
      data: {
        isChat: 'true',
      },
    }

    expect(shouldGoToContractChat(remoteMessage)).toBe(false)
  })

  it('should return false when isChat is not true', () => {
    const remoteMessage = {
      data: {
        contractId: '123',
        isChat: 'false',
      },
    }

    expect(shouldGoToContractChat(remoteMessage)).toBe(false)
  })
})

describe('shouldGoToOffer', () => {
  it('should return true when offerId is present', () => {
    const remoteMessage = {
      data: {
        offerId: '123',
      },
    }

    expect(shouldGoToOffer(remoteMessage)).toBe(true)
  })

  it('should return false when offerId is not present', () => {
    const remoteMessage = {
      data: {},
    }

    expect(shouldGoToOffer(remoteMessage)).toBe(false)
  })
})

describe('shouldGoToYourTradesSell', () => {
  it('should return true when offerId is present and messageType is offer.sellOfferExpired', () => {
    const remoteMessage = {
      data: {
        offerId: '123',
      },
      messageType: 'offer.sellOfferExpired',
    }

    expect(shouldGoToYourTradesSell(remoteMessage)).toBe(true)
  })

  it('should return true when offerId is present and messageType is offer.fundingAmountDifferent', () => {
    const remoteMessage = {
      data: {
        offerId: '123',
      },
      messageType: 'offer.fundingAmountDifferent',
    }

    expect(shouldGoToYourTradesSell(remoteMessage)).toBe(true)
  })

  it('should return true when offerId is present and messageType is offer.wrongFundingAmount', () => {
    const remoteMessage = {
      data: {
        offerId: '123',
      },
      messageType: 'offer.wrongFundingAmount',
    }

    expect(shouldGoToYourTradesSell(remoteMessage)).toBe(true)
  })

  it('should return false when offerId is not present', () => {
    const remoteMessage = {
      data: {},
      messageType: 'offer.sellOfferExpired',
    }

    expect(shouldGoToYourTradesSell(remoteMessage)).toBe(false)
  })

  it('should return false when messageType is not offer.sellOfferExpired', () => {
    const remoteMessage = {
      data: {
        offerId: '123',
      },
      messageType: 'offer.matchBuyer',
    }

    expect(shouldGoToYourTradesSell(remoteMessage)).toBe(false)
  })
})

describe('shouldGoToSearch', () => {
  it('should return true when offerId is present and messageType is offer.matchBuyer', () => {
    const remoteMessage = {
      data: {
        offerId: '123',
      },
      messageType: 'offer.matchBuyer',
    }

    expect(shouldGoToSearch(remoteMessage)).toBe(true)
  })

  it('should return true when offerId is present and messageType is offer.matchSeller', () => {
    const remoteMessage = {
      data: {
        offerId: '123',
      },
      messageType: 'offer.matchSeller',
    }

    expect(shouldGoToSearch(remoteMessage)).toBe(true)
  })

  it('should return true when offerId is present and messageType is offer.escrowFunded', () => {
    const remoteMessage = {
      data: {
        offerId: '123',
      },
      messageType: 'offer.escrowFunded',
    }

    expect(shouldGoToSearch(remoteMessage)).toBe(true)
  })

  it('should return false when offerId is not present', () => {
    const remoteMessage = {
      data: {},
      messageType: 'offer.matchBuyer',
    }

    expect(shouldGoToSearch(remoteMessage)).toBe(false)
  })

  it('should return false when messageType is not offer.matchBuyer', () => {
    const remoteMessage = {
      data: {
        offerId: '123',
      },
      messageType: 'offer.sellOfferExpired',
    }

    expect(shouldGoToSearch(remoteMessage)).toBe(false)
  })
})

describe('shouldGoToSell', () => {
  it('should return true when offerId is present and messageType is offer.notFunded', () => {
    const remoteMessage = {
      data: {
        offerId: '123',
      },
      messageType: 'offer.notFunded',
    }

    expect(shouldGoToSell(remoteMessage)).toBe(true)
  })

  it('should return false when offerId is not present', () => {
    const remoteMessage = {
      data: {},
      messageType: 'offer.notFunded',
    }

    expect(shouldGoToSell(remoteMessage)).toBe(false)
  })

  it('should return false when messageType is not offer.notFunded', () => {
    const remoteMessage = {
      data: {
        offerId: '123',
      },
      messageType: 'offer.sellOfferExpired',
    }

    expect(shouldGoToSell(remoteMessage)).toBe(false)
  })
})
