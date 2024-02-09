import { NETWORK } from "@env";
import { BIP32Interface } from "bip32";
import { getMainAccount } from "./getMainAccount";

export const createPeachAccount = (wallet: BIP32Interface) =>
  getMainAccount(wallet, NETWORK);
