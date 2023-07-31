import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { getBuyOfferIdFromContract } from '../contract'
import { useWalletState } from './walletStore'

export const mapTransactionToOffer = ({ txid }: TransactionDetails): void | null => {
  const sellOffer = useTradeSummaryStore
    .getState()
    .offers.find((offer) => offer.txId === txid || offer.fundingTxId === txid)
  if (sellOffer?.id) return useWalletState.getState().updateTxOfferMap(txid, sellOffer.id)

  const contract = useTradeSummaryStore.getState().contracts.find((cntrct) => cntrct.releaseTxId === txid)
  if (contract) return useWalletState.getState().updateTxOfferMap(txid, getBuyOfferIdFromContract(contract))
  return null
}
