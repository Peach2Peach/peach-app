import { getContract } from '../../contract'
import { getContractStatus } from '../../contract/status'
import { isSellOffer } from '../isSellOffer'
import { hasFundingTransactions } from './hasFundingTransactions'
import { hasSeenAllMatches } from './hasSeenAllMatches'
import { isEscrowRefunded } from './isEscrowRefunded'
import { isEscrowReleased } from './isEscrowReleased'
import { isEscrowWaitingForConfirmation } from './isEscrowWaitingForConfirmation'
import { isOfferCanceled } from './isOfferCanceled'

const getSellOfferStatus = (offer: SellOffer): TradeStatus => {
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

export const getOfferStatus = (offer: SellOffer | BuyOffer): TradeStatus => {
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
