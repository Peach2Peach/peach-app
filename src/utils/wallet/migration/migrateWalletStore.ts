/* eslint-disable no-magic-numbers */
import { WalletStore } from "../walletStore";
import { version0 } from "./version0";
import { version1 } from "./version1";
import { version2 } from "./version2";

export const migrateWalletStore = (
  persistedState: unknown,
  version: number,
): WalletStore | Promise<WalletStore> => {
  let migratedState = persistedState;
  if (version < 1) migratedState = version0(migratedState);
  if (version < 2) migratedState = version1(migratedState);
  if (version < 3) migratedState = version2(migratedState);

  return migratedState as WalletStore;
};
