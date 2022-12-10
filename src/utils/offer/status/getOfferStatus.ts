import { getContract } from '../../contract'
import { isBuyOffer } from '../isBuyOffer'
import { isSellOffer } from '../isSellOffer'
import { hasFundingTransactions } from './hasFundingTransactions'
import { hasSeenAllMatches } from './hasSeenAllMatches'
import { isEscrowRefunded } from './isEscrowRefunded'
import { isEscrowReleased } from './isEscrowReleased'
import { isEscrowWaitingForConfirmation } from './isEscrowWaitingForConfirmation'
import { isKYCConfirmationRequired } from '../../contract/status/isKYCConfirmationRequired'
import { isOfferCanceled } from './isOfferCanceled'
import { isRefundRequired } from './isRefundRequired'
import { requiresDisputeResultAcknowledgement } from './requiresDisputeResultAcknowledgement'
import {
  isKYCRequired,
  isPaymentConfirmationRequired,
  isPaymentRequired,
  isRatingRequired,
  isTradeCanceled,
  isTradeComplete,
} from '../../contract/status'

const getSellOfferStatus = (offer: SellOffer): OfferStatus => {
  if (isEscrowWaitingForConfirmation(offer)) return {
    status: 'escrowWaitingForConfirmation',
    requiredAction: !hasFundingTransactions(offer) ? 'fundEscrow' : '',
  }
  if (offer.returnAddressRequired) return {
    status: 'returnAddressRequired',
    requiredAction: 'provideReturnAddress',
  }
  if (isOfferCanceled(offer)) return {
    status: 'offerCanceled',
    requiredAction:
        hasFundingTransactions(offer) && !isEscrowReleased(offer) && !isEscrowRefunded(offer) ? 'refundEscrow' : '',
  }

  return {
    status: 'null',
    requiredAction: '',
  }
}

const getContractStatus = (offer: BuyOffer | SellOffer, contract: Contract): OfferStatus => {
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

export const getOfferStatus = (offer: SellOffer | BuyOffer): OfferStatus => {
  if (!offer) return { status: 'null', requiredAction: '' }
  const contract = offer.contractId ? getContract(offer.contractId) : null

  if (contract) return getContractStatus(offer, contract)

  if (isSellOffer(offer)) return getSellOfferStatus(offer)

  if (isOfferCanceled(offer)) return {
    status: 'offerCanceled',
    requiredAction: '',
  }

  return {
    status: offer.matches.length === 0 ? 'searchingForPeer' : 'match',
    requiredAction: !hasSeenAllMatches(offer) ? 'checkMatches' : '',
  }
}
