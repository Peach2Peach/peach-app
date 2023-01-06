import { isSellOffer } from '../../../utils/offer'
import { hasFundingTransactions, isEscrowReleased } from '../../../utils/offer/status'
import { shouldGoToOffer } from './shouldGoToOffer'

export const shouldOpenRefundOverlay = (offer: SellOffer | BuyOffer, contract?: Contract): offer is SellOffer =>
  shouldGoToOffer(offer.tradeStatus)
  && isSellOffer(offer)
  && !offer.online
  && (!offer.contractId || (!!contract?.canceled && contract.disputeWinner === 'seller'))
  && hasFundingTransactions(offer)
  && /WRONG_FUNDING_AMOUNT|CANCELED/u.test(offer.funding.status)
  && !isEscrowReleased(offer)
