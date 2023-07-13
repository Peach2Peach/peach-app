import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { useTradeSummaryStore } from '../../../store/tradeSummaryStore'
import { getTransactionType, txIsConfirmed } from '../../../utils/transaction'
import { useWalletState } from '../../../utils/wallet/walletStore'

export const getTxSummary = (tx: TransactionDetails): TransactionSummary => {
  const offerId = useWalletState.getState().txOfferMap[tx.txid]
  const offer = useTradeSummaryStore.getState().getOffer(offerId)
  const contract = offer?.contractId ? useTradeSummaryStore.getState().getContract(offer?.contractId) : undefined
  const sats = Math.abs(tx.sent - tx.received)
  const price = contract?.price
  const currency = contract?.currency
  const type = getTransactionType(tx, offer)

  return {
    id: tx.txid,
    offerId,
    contractId: offer?.contractId,
    type,
    amount: sats,
    price,
    currency,
    date: txIsConfirmed(tx) ? new Date((tx.confirmationTime?.timestamp || Date.now()) * 1000) : new Date(),
    height: tx.confirmationTime?.height,
    confirmed: txIsConfirmed(tx),
  }
}
