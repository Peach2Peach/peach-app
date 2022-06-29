import { diff } from '../array'
import { getContract } from '../contract'

export const isEscrowWaitingForConfirmation = (offer: SellOffer) =>
  offer.type === 'ask'
  && offer.escrow
  && offer.funding.status !== 'FUNDED'
  && offer.funding.status !== 'WRONG_FUNDING_AMOUNT'
  && offer.funding.status !== 'CANCELED'

export const isEscrowTransactionSent = (offer: SellOffer) => offer.funding.status === 'NULL'

export const hasSeenAllMatches = (offer: BuyOffer|SellOffer) => diff(offer.matches, offer.seenMatches).length > 0

export const isOfferCanceled = (offer: BuyOffer|SellOffer) => !offer.online && !offer.contractId

export const isEscrowRefunded = (offer: SellOffer) => offer.refunded

export const isKYCRequired = (offer: BuyOffer, contract: Contract) =>
  offer.type === 'bid'
  && contract.kycRequired
  && !contract.kycConfirmed
  && contract.kycResponseDate !== null

export const isKYCConfirmationRequired = (offer: SellOffer, contract: Contract) =>
  offer.type === 'ask'
  && contract.kycRequired
  && contract.kycResponseDate === null

export const isPaymentRequired = (offer: BuyOffer, contract: Contract) =>
  offer.type === 'bid'
  && !isKYCRequired(offer, contract)
  && contract.paymentMade === null

export const isPaymentConfirmationRequired = (offer: SellOffer, contract: Contract) =>
  offer.type === 'ask'
  && contract.paymentMade !== null
  && !contract.paymentConfirmed

export const isRatingRequired = (offer: SellOffer|BuyOffer, contract: Contract) =>
  offer.type === 'bid' && !contract.ratingSeller
  || offer.type === 'ask' && !contract.ratingBuyer

export const refundRequired = (offer: SellOffer|BuyOffer, contract: Contract) =>
  offer.type === 'ask' && contract.disputeWinner === 'seller'

export const isTradeComplete = (contract: Contract) => contract.paymentConfirmed

export const isTradeCanceled = (contract: Contract) => contract.canceled

/**
 * @description Method to get current status of offer
 * @param offer offer
 * @returns offer status
 */
export const getOfferStatus = (offer: SellOffer|BuyOffer): OfferStatus => {
  if (!offer) return { status: 'null', requiredAction: '' }

  const contract = offer.contractId ? getContract(offer.contractId) : null

  if (contract) {
    if (isTradeComplete(contract)) return {
      status: 'tradeCompleted',
      requiredAction: isRatingRequired(offer, contract) ? 'rate' : ''
    }

    if (isTradeCanceled(contract)) return {
      status: 'tradeCanceled',
      requiredAction: refundRequired(offer, contract) ? 'startRefund' : ''
    }

    return {
      status: 'contractCreated',
      requiredAction: isKYCRequired(offer as BuyOffer, contract)
        ? 'sendKYC'
        : isKYCConfirmationRequired(offer as SellOffer, contract)
          ? 'confirmKYC'
          : isPaymentRequired(offer as BuyOffer, contract)
            ? 'sendPayment'
            : isPaymentConfirmationRequired(offer as SellOffer, contract)
              ? 'confirmPayment'
              : ''
    }
  }

  if (offer.type === 'ask') {
    if (isEscrowWaitingForConfirmation(offer as SellOffer)) return {
      status: 'escrowWaitingForConfirmation',
      requiredAction: isEscrowTransactionSent(offer as SellOffer)
        ? 'fundEscrow'
        : ''
    }
    if (isOfferCanceled(offer)) {
      return {
        status: 'offerCanceled',
        requiredAction: !isEscrowRefunded(offer as SellOffer) ? 'refundEscrow' : ''
      }
    }
  }

  if (isOfferCanceled(offer)) {
    return {
      status: 'offerCanceled',
      requiredAction: ''
    }
  }
  return {
    status: offer.matches.length === 0 ? 'searchingForPeer' : 'match',
    requiredAction: hasSeenAllMatches(offer)
      ? 'checkMatches'
      : ''
  }
}