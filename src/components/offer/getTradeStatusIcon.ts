import { IconType } from '../../assets/icons'

export const getTradeStatusIcon = (disputeActive: boolean, tradeStatus: TradeStatus): IconType | undefined => {
  if (disputeActive) {
    return 'alertOctagon'
  }
  if (tradeStatus === 'confirmPaymentRequired') {
    return 'alertOctagon'
  }
  return undefined
}
