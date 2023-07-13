import { isPastOffer } from './isPastOffer'
import { isOpenAction } from './isOpenAction'
import { isPrioritary } from './isPrioritary'
import { isWaiting } from './isWaiting'
import { isError } from './isError'

export const getCategories = (trades: Pick<TradeSummary, 'tradeStatus' | 'type' | 'unreadMessages'>[]) =>
  [
    { title: 'priority', data: trades.filter(({ tradeStatus }) => isPrioritary(tradeStatus) || isError(tradeStatus)) },
    { title: 'openActions', data: trades.filter(({ type, tradeStatus }) => isOpenAction(type, tradeStatus)) },
    { title: 'waiting', data: trades.filter(({ type, tradeStatus }) => isWaiting(type, tradeStatus)) },
    {
      title: 'newMessages',
      data: trades
        .filter(({ tradeStatus }) => isPastOffer(tradeStatus))
        .filter(({ unreadMessages }) => unreadMessages && unreadMessages > 0),
    },
    {
      title: 'history',
      data: trades
        .filter(({ tradeStatus }) => isPastOffer(tradeStatus))
        .filter(({ unreadMessages }) => !unreadMessages || unreadMessages === 0),
    },
  ].filter(({ data }) => data.length > 0)
