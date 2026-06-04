import { info } from "../../log/info";
import type { WalletTx } from "../bdkShim";
import { WalletState } from "../walletStore";

export type WalletStateVersion3 = {
  balance: number;
  addresses: string[];
  transactions: WalletTx[];
  fundedFromPeachWallet: string[];
  txOfferMap: Record<string, string[]>;
  addressLabelMap: Record<string, string>;
  fundMultipleMap: Record<string, string[]>;
  showBalance: boolean;
  selectedUTXOIds: string[];
  isSynced: boolean;
};

export const version3 = (persistedState: unknown): WalletState => {
  info("WalletStore - migrating from version 3");

  const v3 = persistedState as WalletStateVersion3;

  return {
    balance: v3.balance,
    transactions: [],
    fundedFromPeachWallet: v3.fundedFromPeachWallet,
    txOfferMap: v3.txOfferMap,
    addressLabelMap: v3.addressLabelMap,
    showBalance: v3.showBalance,
    selectedUTXOIds: v3.selectedUTXOIds,
    hasScanned: false,
    externalUsedIndices: [],
  };
};
