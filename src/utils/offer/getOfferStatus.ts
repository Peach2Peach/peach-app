import { diff } from '../array'
import { getContract } from '../contract'

const isEscrowWaitingForConfirmation = (offer: SellOffer) =>
  offer.type === 'ask'
  && offer.escrow
  && offer.funding?.status !== 'FUNDED'
  && offer.funding?.status !== 'WRONG_FUNDING_AMOUNT'
  && offer.funding?.status !== 'CANCELED'

const isEscrowTransactionSent = (offer: SellOffer) => offer.funding?.status === 'NULL'

const hasSeenAllMatches = (offer: BuyOffer|SellOffer) => diff(offer.matches, offer.seenMatches).length > 0

const isOfferCanceled = (offer: BuyOffer|SellOffer) => !offer.online && !offer.contractId

const isEscrowRefunded = (offer: SellOffer) => offer.refunded

const isKYCRequired = (offer: BuyOffer, contract: Contract) =>
  offer.type === 'bid'
  && contract.kycRequired
  && !contract.kycConfirmed
  && contract.kycResponseDate !== null

const isKYCConfirmationRequired = (offer: SellOffer, contract: Contract) =>
  offer.type === 'ask'
  && contract.kycRequired
  && contract.kycResponseDate === null

const isPaymentRequired = (offer: BuyOffer, contract: Contract) =>
  offer.type === 'bid'
  && !isKYCRequired(offer, contract)
  && contract.paymentMade === null

const isPaymentConfirmationRequired = (offer: SellOffer, contract: Contract) =>
  offer.type === 'ask'
  && contract.paymentMade !== null
  && !contract.paymentConfirmed

const isRatingRequired = (offer: SellOffer|BuyOffer, contract: Contract) =>
  offer.type === 'bid' && !contract.ratingBuyer
  || offer.type === 'ask' && !contract.ratingSeller

const isTradeComplete = (contract: Contract) => contract.paymentConfirmed

const isTradeCanceled = (contract: Contract) => contract.canceled

/**
 * @description Method to get current status of offer
 * @param offer offer
 * @returns offer status
 */
export const getOfferStatus = (offer: SellOffer|BuyOffer): OfferStatus => {
  const contract = offer.contractId ? getContract(offer.contractId) : null

  if (contract) {
    if (isTradeComplete(contract)) return {
      status: 'tradeCompleted',
      requiredAction: isRatingRequired(offer, contract) ? 'rate' : ''
    }

    if (isTradeCanceled(contract)) return {
      status: 'tradeCanceled',
      requiredAction: ''
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
        requiredAction: ''
      }
    }
  }

  if (isOfferCanceled(offer)) {
    return {
      status: 'offerCanceled',
      requiredAction: !isEscrowRefunded(offer as SellOffer) ? 'refundEscrow' : ''
    }
  }
  return {
    status: offer.matches.length === 0 ? 'searchingForPeer' : 'match',
    requiredAction: hasSeenAllMatches(offer)
      ? 'checkMatches'
      : ''
  }
}