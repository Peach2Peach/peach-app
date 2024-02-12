import { BIP32Interface } from "bip32";
import { peachAPI } from "../peachAPI";
import { PeachLiquidJSWallet } from "../wallet/PeachLiquidJSWallet";
import { PeachWallet } from "../wallet/PeachWallet";
import { getLiquidNetwork } from "../wallet/getLiquidNetwork";
import {
  setLiquidWallet,
  setPeachWallet,
  setWallet,
} from "../wallet/setWallet";
import { createPeachAccount } from "./createPeachAccount";

export const setWallets = async (
  wallet: BIP32Interface,
  seedPhrase: string,
) => {
  setWallet(wallet);
  const peachAccount = createPeachAccount(wallet);
  peachAPI.setPeachAccount(peachAccount);
  await peachAPI.authenticate();

  const peachWallet = new PeachWallet({ wallet });
  const liquidWallet = new PeachLiquidJSWallet({
    wallet,
    network: getLiquidNetwork(),
  });
  peachWallet.loadWallet(seedPhrase);
  setPeachWallet(peachWallet);
  setLiquidWallet(liquidWallet);
};
