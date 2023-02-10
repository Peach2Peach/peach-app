import { isPastOffer } from './isPastOffer'
import { isOpenAction } from './isOpenAction'
import { isPrioritary } from './isPrioritary'
import { isWaiting } from './isWaiting'

export const getCategories = (trades: TradeSummary[]) => {
  const categories: { title: any; data: any }[] = []

  const addCategory = (title: string, data: TradeSummary[]) => {
    if (data.length > 0) {
      categories.push({ title, data })
    }
  }

  addCategory(
    'priority',
    trades.filter(({ tradeStatus }) => isPrioritary(tradeStatus)),
  )
  addCategory(
    'openActions',
    trades.filter(({ type, tradeStatus }) => isOpenAction(type, tradeStatus)),
  )
  addCategory(
    'waiting',
    trades.filter(({ type, tradeStatus }) => isWaiting(type, tradeStatus)),
  )

  const pastOffers = trades.filter(({ tradeStatus }) => isPastOffer(tradeStatus))
  addCategory(
    'newMessages',
    pastOffers.filter(({ unreadMessages }) => unreadMessages && unreadMessages > 0),
  )
  addCategory(
    'history',
    pastOffers.filter(({ unreadMessages }) => !unreadMessages || unreadMessages <= 0),
  )

  return categories
}
