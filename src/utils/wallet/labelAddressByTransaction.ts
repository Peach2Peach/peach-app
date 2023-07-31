import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { useWalletState } from './walletStore'
import { getTxDefaultLabel } from './getTxDefaultLabel'
import { getOffer, isSellOffer } from '../offer'

export const labelAddressByTransaction = (tx: TransactionDetails): void => {
  const offerId = useWalletState.getState().txOfferMap[tx.txid]
  const offer = getOffer(offerId)
  if (!offer) return

  const address = isSellOffer(offer) ? offer.returnAddress : offer.releaseAddress
  const label = getTxDefaultLabel(tx)

  if (!label) return
  useWalletState.getState().labelAddress(address, label)
}
