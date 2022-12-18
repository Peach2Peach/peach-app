import { isSellOffer } from '../../../utils/offer'
import { hasFundingTransactions, isEscrowReleased } from '../../../utils/offer/status'

export const shouldUpdateOverlay = (
  offer: SellOffer | BuyOffer,
  offerStatus: TradeStatus,
  contract: Contract | null,
): offer is SellOffer =>
  !/rate/u.test(offerStatus.requiredAction)
  && /offerPublished|searchingForPeer|offerCanceled|tradeCompleted|tradeCanceled/u.test(offerStatus.status)
  && isSellOffer(offer)
  && !offer.online
  && (!offer.contractId || (!!contract?.canceled && contract.disputeWinner === 'seller'))
  && hasFundingTransactions(offer)
  && /WRONG_FUNDING_AMOUNT|CANCELED/u.test(offer.funding.status)
  && !isEscrowReleased(offer)
