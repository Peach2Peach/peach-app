import { getSellOfferFromContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'

export const getTradeActionStatus = (contract: Contract, view: ContractViewer) => {
  if (view === 'buyer') {
    if (contract.cancelationRequested || (contract.disputeWinner === 'buyer' && !contract.releaseTxId)) {
      return i18n('contract.status.notResolved')
    }
    if (contract.disputeWinner === 'buyer' && contract.releaseTxId) {
      return i18n('contract.buyer.status.paidOut')
    }
    return i18n('contract.buyer.status.sellerRefunded')
  }
  const sellOffer = getSellOfferFromContract(contract)
  if (sellOffer.newOfferId) {
    return i18n('contact.seller.status.republished')
  } else if (sellOffer.refunded) {
    return i18n('contract.seller.status.refunded')
  } else if (contract.releaseTxId) {
    return i18n('contract.seller.status.releasedToBuyer')
  }
  return i18n('contract.status.notResolved')
}
