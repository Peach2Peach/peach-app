import type { WalletTx } from "./bdkShim";
import { useWalletState } from "./walletStore";

export const transactionHasBeenMappedToOffers = ({ txid }: WalletTx) =>
  !!useWalletState.getState().txOfferMap[txid];
