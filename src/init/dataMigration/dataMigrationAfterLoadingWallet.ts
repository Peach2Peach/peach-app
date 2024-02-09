import { BIP32Interface } from "bip32";
import { storeBase58 } from "./afterLoadingWallet/storeBase58";

export const dataMigrationAfterLoadingWallet = (
  wallet: BIP32Interface,
  account: Account,
) => {
  storeBase58(wallet, account);
};
