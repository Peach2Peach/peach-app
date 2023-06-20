import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { useBitcoinStore } from '../../../store/bitcoinStore'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import { getTransactionType, txIsConfirmed } from '../../../utils/transaction'
import { useWalletState } from '../../../utils/wallet/walletStore'

export const getTxSummary = (tx: TransactionDetails) => {
  const offerId = useWalletState.getState().txOfferMap[tx.txid]
  const offer = useTradeSummaryStore.getState().getOffer(offerId)
  const sats = Math.abs(tx.sent - tx.received)
  const price = sats / useBitcoinStore.getState().satsPerUnit
  const type = getTransactionType(tx, offer)

  return {
    id: tx.txid,
    offerId,
    contractId: offer?.contractId,
    type,
    amount: sats,
    price,
    currency: useBitcoinStore.getState().currency,
    date: txIsConfirmed(tx) ? new Date((tx.confirmationTime?.timestamp || Date.now()) * 1000) : new Date(),
    confirmed: txIsConfirmed(tx),
  }
}
