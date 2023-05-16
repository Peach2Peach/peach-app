import { IconType } from '../../assets/icons'
import { isPaymentTooLate } from './isPaymentTooLate'

export const getTradeSeparatorIcon = (
  contract: Pick<Contract, 'tradeStatus' | 'paymentMade' | 'paymentExpectedBy'>,
  view: ContractViewer,
): IconType | undefined => {
  const { tradeStatus } = contract
  if (isPaymentTooLate(contract) && view === 'seller') {
    return 'clock'
  }
  if (tradeStatus === 'tradeCompleted') {
    return undefined
  }
  if (tradeStatus === 'tradeCanceled') {
    return 'xCircle'
  }
  if (tradeStatus === 'refundOrReviveRequired') {
    return 'alertOctagon'
  }
  return undefined
}
