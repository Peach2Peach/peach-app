import { checkMessages } from '../../../../../src/views/yourTrades/utils/checkMessages'

describe('checkMessages', () => {
  it('should return the correct number of unread messages', () => {
    const openOffers = {
      buy: [{ unreadMessages: 3 } as ContractSummary, { unreadMessages: 2 } as ContractSummary],
      sell: [{ unreadMessages: 1 } as ContractSummary],
    }
    const pastOffers = [{ unreadMessages: 5 } as ContractSummary, { unreadMessages: 0 } as ContractSummary]

    const result = checkMessages(openOffers, pastOffers)
    expect(result).toEqual({ buy: 5, sell: 1, history: 5 })
  })

  it('should return 0 for unread messages if no messages exist', () => {
    const openOffers = {
      buy: [{ unreadMessages: 0 } as ContractSummary, { unreadMessages: 0 } as ContractSummary],
      sell: [{ unreadMessages: 0 } as ContractSummary],
    }
    const pastOffers = [{ unreadMessages: 0 } as ContractSummary, { unreadMessages: 0 } as ContractSummary]

    const result = checkMessages(openOffers, pastOffers)
    expect(result).toEqual({ buy: 0, sell: 0, history: 0 })
  })

  it('should return 0 for unread messages if the trade is not a ContractSummary', () => {
    const openOffers = {
      buy: [{ unreadMessages: 3 } as ContractSummary, {} as OfferSummary],
      sell: [{ unreadMessages: 1 } as ContractSummary, {} as OfferSummary],
    }
    const pastOffers = [{ unreadMessages: 5 } as ContractSummary, {} as OfferSummary]

    const result = checkMessages(openOffers, pastOffers)
    expect(result).toEqual({ buy: 3, sell: 1, history: 5 })
  })
})
