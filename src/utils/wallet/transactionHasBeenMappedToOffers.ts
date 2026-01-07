import { useWalletState } from "./walletStore";
import { WalletTransaction } from "./WalletTransaction";

export const transactionHasBeenMappedToOffers = ({ txid }: WalletTransaction) =>
  !!useWalletState.getState().txOfferMap[txid];
