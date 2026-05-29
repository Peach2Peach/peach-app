/* eslint-disable no-magic-numbers */
import type { WalletTx } from "../../../src/utils/wallet/bdkShim";

export const getTransactionDetails = (
  amount = 10000,
  feeRate = 1,
  txId = "txId",
): WalletTx => {
  const feeAmount = feeRate * 110;
  return {
    txid: txId,
    sent: 0,
    received: amount,
    fee: feeAmount,
    confirmationTime: { height: 1, timestamp: 1 },
    transaction: {
      hex: "",
      id: txId,
      vsize: 110,
    },
  };
};
