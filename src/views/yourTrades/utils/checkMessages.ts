import { isContractSummary } from './isContractSummary'
export const checkMessages = (
  openOffers: {
    buy: (ContractSummary | OfferSummary)[]
    sell: (ContractSummary | OfferSummary)[]
  },
  pastOffers: (ContractSummary | OfferSummary)[],
) => {
  let buyMessages = 0
  let sellMessages = 0
  let pastMessages = 0

  openOffers.buy.forEach((trade) => {
    if (isContractSummary(trade) && trade.unreadMessages) {
      buyMessages += trade.unreadMessages
    }
  })
  openOffers.sell.forEach((trade) => {
    if (isContractSummary(trade) && trade.unreadMessages) {
      sellMessages += trade.unreadMessages
    }
  })
  pastOffers.forEach((trade) => {
    if (isContractSummary(trade) && trade.unreadMessages) {
      pastMessages += trade.unreadMessages
    }
  })
  return { buy: buyMessages, sell: sellMessages, history: pastMessages }
}
