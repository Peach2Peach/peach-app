import { isPrioritary } from './isPrioritary'
import { isWaiting } from './isWaiting'

export const getOfferLevel = (type: Offer['type'], tradeStatus: TradeStatus) => {
  if (isPrioritary(tradeStatus)) return 'WARN'
  else if (isWaiting(type, tradeStatus)) return 'WAITING'
  return 'APP'
}
