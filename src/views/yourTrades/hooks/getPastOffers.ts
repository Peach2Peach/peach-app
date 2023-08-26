import { isPastOffer } from '../utils'

export const getPastOffers = (trades: (OfferSummary | ContractSummary)[]) =>
  trades.filter(
    (item) =>
      isPastOffer(item.tradeStatus)
      && ((item.type === 'ask' && 'fundingTxId' in item && !!item?.fundingTxId) || item.tradeStatus !== 'offerCanceled'),
  )
