import { getContract } from '../../contract'
import { isSellOffer } from '../isSellOffer'
import { hasSeenAllMatches } from './hasSeenAllMatches'
import { isContractPendingForCancelation } from './isContractPendingForCancelation'
import { isDisputeActive } from './isDisputeActive'
import { isEscrowRefunded } from './isEscrowRefunded'
import { isEscrowTransactionSent } from './isEscrowTransactionSent'
import { isEscrowWaitingForConfirmation } from './isEscrowWaitingForConfirmation'
import { isKYCConfirmationRequired } from './isKYCConfirmationRequired'
import { isKYCRequired } from './isKYCRequired'
import { isOfferCanceled } from './isOfferCanceled'
import { isPaymentConfirmationRequired } from './isPaymentConfirmationRequired'
import { isPaymentRequired } from './isPaymentRequired'
import { isRatingRequired } from './isRatingRequired'
import { isRefundRequired } from './isRefundRequired'
import { isTradeCanceled } from './isTradeCanceled'
import { isTradeComplete } from './isTradeComplete'
import { requiresDisputeResultAcknowledgement } from './requiresDisputeResultAcknowledgement'

// eslint-disable-next-line complexity
export const getOfferStatus = (offer: SellOffer | BuyOffer): OfferStatus => {
  if (!offer) return { status: 'null', requiredAction: '' }

  const contract = offer.contractId ? getContract(offer.contractId) : null

  if (contract) {
    if (isTradeComplete(contract)) return {
      status: 'tradeCompleted',
      requiredAction: isDisputeActive(contract)
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

    return {
      status: 'contractCreated',
      requiredAction: isContractPendingForCancelation(contract)
        ? 'confirmCancelation'
        : isKYCRequired(offer as BuyOffer, contract)
          ? 'sendKYC'
          : isKYCConfirmationRequired(offer as SellOffer, contract)
            ? 'confirmKYC'
            : isPaymentRequired(offer as BuyOffer, contract)
              ? 'sendPayment'
              : isPaymentConfirmationRequired(offer as SellOffer, contract)
                ? 'confirmPayment'
                : '',
    }
  }

  if (isSellOffer(offer)) {
    if (isEscrowWaitingForConfirmation(offer)) return {
      status: 'escrowWaitingForConfirmation',
      requiredAction: !isEscrowTransactionSent(offer) ? 'fundEscrow' : '',
    }
    if (offer.returnAddressRequired) return {
      status: 'returnAddressRequired',
      requiredAction: 'provideReturnAddress',
    }
    if (isOfferCanceled(offer)) {
      return {
        status: 'offerCanceled',
        requiredAction: isEscrowTransactionSent(offer) && !isEscrowRefunded(offer) ? 'refundEscrow' : '',
      }
    }
  }

  if (isOfferCanceled(offer)) {
    return {
      status: 'offerCanceled',
      requiredAction: '',
    }
  }
  return {
    status: offer.matches.length === 0 ? 'searchingForPeer' : 'match',
    requiredAction: hasSeenAllMatches(offer) ? 'checkMatches' : '',
  }
}
