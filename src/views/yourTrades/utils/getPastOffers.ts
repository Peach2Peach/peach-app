import { isPastOffer } from './isPastOffer'

export const getPastOffers = (trades: TradeSummary[]) =>
  trades.filter(
    (item) =>
      isPastOffer(item.tradeStatus)
      && ((item.type === 'ask' && 'fundingTxId' in item && !!item?.fundingTxId) || item.tradeStatus !== 'offerCanceled'),
  )
