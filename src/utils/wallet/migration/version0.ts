import { TransactionDetails } from "bdk-rn/lib/classes/Bindings";
import { info } from "../../log/info";
import { WalletStateVersion1 } from "./version1";

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
export type WalletStateVersion0 = {
  balance: number;
  addresses: string[];
  transactions: TransactionsResponse;
  pendingTransactions: Record<string, string>;
  txOfferMap: Record<string, string>;
  fundedFromPeachWallet: string[];
  addressLabelMap: Record<string, string>;
  fundMultipleMap: Record<string, string[]>;
  showBalance: boolean;
  selectedUTXOIds: string[];
  isSynced: boolean;
};

const convertLegacyTxConfirmed = (tx: ConfirmedTransaction) => ({
  txid: tx.txid,
  received: tx.received,
  sent: tx.sent,
  fee: tx.fee,
  confirmationTime: {
    height: tx.block_height,
    timestamp: tx.block_timestamp,
  },
});
const convertLegacyTxPending = (tx: PendingTransaction): TransactionDetails =>
  tx;

export const version0 = (persistedState: unknown): WalletStateVersion1 => {
  info("WalletStore - migrating from version 0");

  const version0State = persistedState as WalletStateVersion0;
  const { confirmed, pending } = version0State.transactions;

  return {
    ...version0State,
    transactions: [
      ...confirmed.map(convertLegacyTxConfirmed),
      ...pending.map(convertLegacyTxPending),
    ],
  };
};
