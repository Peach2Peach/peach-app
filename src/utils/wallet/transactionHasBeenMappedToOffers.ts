import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { useWalletState } from "./walletStore";

export const transactionHasBeenMappedToOffers = ({
  txid,
}: TransactionDetails) => !!useWalletState.getState().txOfferMap[txid];
