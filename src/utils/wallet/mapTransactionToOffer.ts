import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { getBuyOfferIdFromContract } from '../contract/getBuyOfferIdFromContract'
import { useWalletState } from './walletStore'

export const mapTransactionToOffer = ({ txid }: TransactionDetails): void | null => {
  const sellOffers = useTradeSummaryStore
    .getState()
    .offers.filter((offer) => offer.txId === txid || offer.fundingTxId === txid)
  if (sellOffers.length) return useWalletState.getState().updateTxOfferMap(
    txid,
    sellOffers.map(({ id }) => id),
  )

  const contracts = useTradeSummaryStore.getState().contracts.filter((cntrct) => cntrct.releaseTxId === txid)
  if (contracts.length) return useWalletState.getState().updateTxOfferMap(txid, contracts.map(getBuyOfferIdFromContract))
  return null
}
