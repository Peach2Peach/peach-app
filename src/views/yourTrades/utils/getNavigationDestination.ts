import { getContract } from '../../../utils/contract'
import { getOffer } from '../../../utils/offer'
import { shouldGoToOfferSummary } from './'

export const getNavigationDestinationForContract = (contract: ContractSummary): [string, object | undefined] => {
  if (contract.tradeStatus === 'tradeCompleted') {
    const fullContract = getContract(contract.id)
    if (fullContract) return ['tradeComplete', { contract: fullContract }]
  }
  return ['contract', { contractId: contract.id }]
}

export const getNavigationDestinationForOffer = (offer: OfferSummary): [string, object | undefined] => {
  if (shouldGoToOfferSummary(offer.tradeStatus)) {
    return ['offer', { offerId: offer.id }]
  }

  if (offer.tradeStatus === 'returnAddressRequired') {
    return ['setReturnAddress', { offer: getOffer(offer.id) }]
  }
  if (offer.tradeStatus === 'fundEscrow') {
    return ['fundEscrow', { offer: getOffer(offer.id) }]
  }
  if (/searchingForPeer|hasMatchesAvailable/u.test(offer.tradeStatus)) {
    return ['search', undefined]
  }

  return ['yourTrades', undefined]
}
