import { isBuyOffer } from '../../offer'
import { isRefundRequired, requiresDisputeResultAcknowledgement } from '../../offer/status'
import { isKYCConfirmationRequired } from './isKYCConfirmationRequired'
import { isKYCRequired } from './isKYCRequired'
import { isPaymentConfirmationRequired } from './isPaymentConfirmationRequired'
import { isPaymentRequired } from './isPaymentRequired'
import { isRatingRequired } from './isRatingRequired'
import { isTradeCanceled } from './isTradeCanceled'
import { isTradeComplete } from './isTradeComplete'

export const getContractStatus = (offer: BuyOffer | SellOffer, contract: Contract): TradeStatus => {
  if (isTradeComplete(contract)) return {
    status: 'tradeCompleted',
    requiredAction: contract.disputeActive
      ? 'dispute'
      : requiresDisputeResultAcknowledgement(contract)
        ? 'acknowledgeDisputeResult'
        : isRatingRequired(offer, contract)
          ? 'rate'
          : '',
  }

  if (isTradeCanceled(contract)) return {
    status: 'tradeCanceled',
    requiredAction: isRefundRequired(offer, contract) ? 'startRefund' : '',
  }

  if (isBuyOffer(offer)) return {
    status: 'contractCreated',
    requiredAction: contract.cancelationRequested
      ? 'confirmCancelation'
      : isKYCRequired(contract)
        ? 'sendKYC'
        : isPaymentRequired(contract)
          ? 'sendPayment'
          : '',
  }

  return {
    status: 'contractCreated',
    requiredAction: contract.cancelationRequested
      ? 'confirmCancelation'
      : isKYCConfirmationRequired(contract)
        ? 'confirmKYC'
        : isPaymentConfirmationRequired(contract)
          ? 'confirmPayment'
          : '',
  }
}
