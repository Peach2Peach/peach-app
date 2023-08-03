import { TransactionDetails } from 'bdk-rn/lib/classes/Bindings'
import { useWalletState } from './walletStore'

export const transactionHasBeenMappedToOffer = ({ txid }: TransactionDetails): string =>
  useWalletState.getState().txOfferMap[txid]
