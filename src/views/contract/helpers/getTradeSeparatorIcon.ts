import { IconType } from '../../../assets/icons'
import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'
import { shouldShowTradeStatusInfo } from './shouldShowTradeStatusInfo'

export const getTradeSeparatorIcon = (
  contract: Pick<
    Contract,
    'tradeStatus' | 'paymentMade' | 'paymentExpectedBy' | 'canceled' | 'disputeWinner' | 'cancelationRequested'
  >,
  view: ContractViewer,
): IconType | undefined => {
  const { canceled, disputeWinner } = contract
  if (isPaymentTooLate(contract) && (view === 'seller' || canceled)) {
    return 'clock'
  }
  if (disputeWinner) {
    return 'alertCircle'
  }
  if (shouldShowTradeStatusInfo(contract, view)) {
    return 'xCircle'
  }
  return undefined
}
