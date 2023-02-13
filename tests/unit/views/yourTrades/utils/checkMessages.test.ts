import { checkMessages } from '../../../../../src/views/yourTrades/utils/checkMessages'

const contractSummary = {
  price: 1,
  currency: 'EUR',
}

describe('checkMessages', () => {
  it('should return the correct number of unread messages', () => {
    const openOffers = {
      buy: [
        { ...contractSummary, unreadMessages: 3 } as ContractSummary,
        { ...contractSummary, unreadMessages: 2 } as ContractSummary,
      ],
      sell: [{ ...contractSummary, unreadMessages: 1 } as ContractSummary],
    }
    const pastOffers = [
      { ...contractSummary, unreadMessages: 5 } as ContractSummary,
      { ...contractSummary, unreadMessages: 0 } as ContractSummary,
    ]

    const result = checkMessages(openOffers, pastOffers)
    expect(result).toEqual({ buy: 5, sell: 1, history: 5 })
  })

  it('should return 0 for unread messages if no messages exist', () => {
    const openOffers = {
      buy: [
        { ...contractSummary, unreadMessages: 0 } as ContractSummary,
        { ...contractSummary, unreadMessages: 0 } as ContractSummary,
      ],
      sell: [{ ...contractSummary, unreadMessages: 0 } as ContractSummary],
    }
    const pastOffers = [
      { ...contractSummary, unreadMessages: 0 } as ContractSummary,
      { ...contractSummary, unreadMessages: 0 } as ContractSummary,
    ]

    const result = checkMessages(openOffers, pastOffers)
    expect(result).toEqual({ buy: 0, sell: 0, history: 0 })
  })

  it('should return 0 for unread messages if the trade is not a ContractSummary', () => {
    const openOffers = {
      buy: [{ ...contractSummary, unreadMessages: 3 } as ContractSummary, {} as OfferSummary],
      sell: [{ ...contractSummary, unreadMessages: 1 } as ContractSummary, {} as OfferSummary],
    }
    const pastOffers = [{ ...contractSummary, unreadMessages: 5 } as ContractSummary, {} as OfferSummary]

    const result = checkMessages(openOffers, pastOffers)
    expect(result).toEqual({ buy: 3, sell: 1, history: 5 })
  })
})
