import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { bitcoinStore } from '../../../store/bitcoinStore'
import { tradeSummaryStore } from '../../../store/tradeSummaryStore'
import { getTransactionType, txIsConfirmed } from '../../../utils/transaction'
import { walletStore } from '../../../utils/wallet/walletStore'

export const getTxSummary = (tx: TransactionDetails) => {
  const offerId = walletStore.getState().txOfferMap[tx.txid]
  const offer = tradeSummaryStore.getState().getOffer(offerId)
  const sats = Math.abs(tx.received - tx.sent)
  const price = sats / bitcoinStore.getState().satsPerUnit
  const type = getTransactionType(tx, offer)

  return {
    id: tx.txid,
    offerId,
    contractId: offer?.contractId,
    type,
    amount: sats,
    price,
    currency: bitcoinStore.getState().currency,
    date: txIsConfirmed(tx) ? new Date((tx.confirmationTime?.timestamp || Date.now()) * 1000) : new Date(),
    confirmed: txIsConfirmed(tx),
  }
}
