import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { contractIdToHex } from '../contract'
import { offerIdToHex } from '../offer'
import { useWalletState } from './walletStore'

export const getTxDefaultLabel = (tx: TransactionDetails) => {
  const offerId = useWalletState.getState().txOfferMap[tx.txid]
  const offer = useTradeSummaryStore.getState().getOffer(offerId)
  const contract = offer?.contractId ? useTradeSummaryStore.getState().getContract(offer?.contractId) : undefined

  if (contract) return contractIdToHex(contract.id)
  if (offer) return offerIdToHex(offer.id)

  return undefined
}
