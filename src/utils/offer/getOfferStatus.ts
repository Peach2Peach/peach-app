import { diff } from '../array'
import { getContract } from '../contract'

/**
 * @description Method to get current status of offer
 * @param offer offer
 * @returns offer status
 */
// eslint-disable-next-line complexity
export const getOfferStatus = (offer: SellOffer|BuyOffer): OfferStatus => {
  const contract = offer.contractId ? getContract(offer.contractId) : null

  if (contract) {
    if (contract.paymentConfirmed) return {
      status: 'tradeCompleted',
      // if it requires rating
      actionRequired: offer.type === 'bid' && !contract.ratingBuyer
        || offer.type === 'ask' && contract.ratingSeller
    }

    if (contract.canceled) return {
      status: 'offerCanceled',
      actionRequired: false
    }

    if (offer.type === 'bid') return {
      status: 'contractCreated',
      // if it requires sending KYC or Payment
      actionRequired: contract.kycRequired && !contract.kycConfirmed && contract.kycResponseDate !== null
        || contract.kycRequired && contract.kycConfirmed && contract.paymentMade === null
    }
    return {
      status: 'contractCreated',
      // if it requires confirming KYC or reception of payment
      actionRequired: contract.kycRequired && !contract.kycConfirmed === null
        || contract.paymentMade === null && !contract.paymentConfirmed
    }
  }

  if (!offer.online && !offer.contractId) return {
    status: 'offerCanceled',
    actionRequired: false
  }

  if (offer.type === 'ask') {
    if (offer.escrow && offer.funding?.status !== 'FUNDED') return {
      status: 'escrowWaitingForConfirmation',
      // if it requires funding escrow
      actionRequired: offer.funding?.status === 'NULL'
    }
  }
  if (offer.online) return {
    status: 'offerPublished',
    // if not all matches have been seen
    actionRequired: diff(offer.matches, offer.seenMatches).length > 0
  }
  return {
    status: 'null',
    actionRequired: false
  }
}