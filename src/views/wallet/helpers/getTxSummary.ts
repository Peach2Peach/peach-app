import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import { getOffer, isBuyOffer } from '../../../utils/offer'
import { getTransactionType, txIsConfirmed } from '../../../utils/transaction'
import { isDefined } from '../../../utils/validation'
import { useWalletState } from '../../../utils/wallet/walletStore'

const mapOfferToOfferData = (offer: SellOffer | BuyOffer) => {
  const contract = offer?.contractId ? useTradeSummaryStore.getState().getContract(offer?.contractId) : undefined

  return {
    offerId: offer.id,
    contractId: offer.contractId,
    amount: contract?.amount || (Array.isArray(offer.amount) ? offer.amount[0] : offer.amount),
    address: isBuyOffer(offer) ? offer.releaseAddress : offer?.returnAddress,
    currency: contract?.currency,
    price: contract?.price,
  }
}

export const getTxSummary = (tx: TransactionDetails): TransactionSummary => {
  const offerIds = useWalletState.getState().txOfferMap[tx.txid] || []
  const offers = offerIds.map(getOffer).filter(isDefined)

  const offerData = offers.map(mapOfferToOfferData)
  const sats = Math.abs(tx.sent - tx.received)

  return {
    id: tx.txid,
    type: getTransactionType(tx, offers?.[0]),
    offerData,
    amount: sats,
    date: txIsConfirmed(tx) ? new Date((tx.confirmationTime?.timestamp || Date.now()) * 1000) : new Date(),
    height: tx.confirmationTime?.height,
    confirmed: txIsConfirmed(tx),
  }
}
