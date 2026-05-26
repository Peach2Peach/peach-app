import { info } from "../../log/info";
import { omit } from "../../object/omit";
import type { WalletTx } from "../bdkShim";
import { WalletStateVersion3 } from "./version3";

export type ConfirmedTransaction = {
  txid: string;
  block_timestamp: number;
  sent: number;
  block_height: number;
  received: number;
  fee: number;
};
export type PendingTransaction = {
  txid: string;
  sent: number;
  received: number;
  fee: number;
};
export type TransactionsResponse = {
  confirmed: ConfirmedTransaction[];
  pending: PendingTransaction[];
};
export type WalletStateVersion2 = {
  balance: number;
  addresses: string[];
  transactions: WalletTx[];
  pendingTransactions: Record<string, string>;
  fundedFromPeachWallet: string[];
  txOfferMap: Record<string, string[]>;
  addressLabelMap: Record<string, string>;
  fundMultipleMap: Record<string, string[]>;
  showBalance: boolean;
  selectedUTXOIds: string[];
  isSynced: boolean;
};

export const version2 = (persistedState: unknown): WalletStateVersion3 => {
  info("WalletStore - migrating from version 2");

  const version2State = persistedState as WalletStateVersion2;

  return omit(version2State, "pendingTransactions");
};
