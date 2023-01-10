import { ConfirmedTransaction, PendingTransaction } from 'bdk-rn/lib/lib/interfaces'
import { bitcoinStore } from '../../../store/bitcoinStore'
import { getOffer } from '../../../utils/offer'
import { getTransactionType, txIsConfirmed } from '../../../utils/transaction'
import { walletStore } from '../../../utils/wallet/walletStore'

export const getTxSummary = (tx: ConfirmedTransaction | PendingTransaction) => {
  const offer = getOffer(walletStore.getState().txOfferMap[tx.txid])
  const sats = Math.abs(tx.received - tx.sent)
  const price = sats / bitcoinStore.getState().satsPerUnit
  const type = getTransactionType(tx, offer)

  return {
    id: tx.txid,
    offerId: offer?.id,
    type,
    amount: sats,
    price,
    currency: bitcoinStore.getState().currency,
    date: txIsConfirmed(tx) ? new Date(tx.block_timestamp * 1000) : new Date(),
    confirmed: txIsConfirmed(tx),
  }
}
