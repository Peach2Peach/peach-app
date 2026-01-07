export type WalletTransaction = {
  txid: string;
  received: number;
  sent: number;
  fee?: number;
  confirmationTime?: {
    height?: number;
    timestamp?: number;
  };
};
