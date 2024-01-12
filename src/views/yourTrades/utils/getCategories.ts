import { ContractSummary } from '../../../../peach-api/src/@types/contract'
import { OfferSummary } from '../../../../peach-api/src/@types/offer'
import { isError } from './isError'
import { isOpenAction } from './isOpenAction'
import { isPastOffer } from './isPastOffer'
import { isPrioritary } from './isPrioritary'
import { isTradeStatus } from './isTradeStatus'
import { isWaiting } from './isWaiting'

export const getCategories = (trades: (OfferSummary | ContractSummary)[]) =>
  [
    { title: 'priority', data: trades.filter(({ tradeStatus }) => isPrioritary(tradeStatus) || isError(tradeStatus)) },
    { title: 'openActions', data: trades.filter(({ type, tradeStatus }) => isOpenAction(type, tradeStatus)) },
    { title: 'waiting', data: trades.filter(({ type, tradeStatus }) => isWaiting(type, tradeStatus)) },
    {
      title: 'newMessages',
      data: trades
        .filter(({ tradeStatus }) => isPastOffer(tradeStatus))
        .filter((trade) => 'unreadMessages' in trade && trade.unreadMessages > 0),
    },
    {
      title: 'history',
      data: trades
        .filter(({ tradeStatus }) => isPastOffer(tradeStatus))
        .filter((trade) => !('unreadMessages' in trade) || trade.unreadMessages === 0),
    },
    { title: 'unknown', data: trades.filter(({ tradeStatus }) => !isTradeStatus(tradeStatus)) },
  ].filter(({ data }) => data.length > 0)
