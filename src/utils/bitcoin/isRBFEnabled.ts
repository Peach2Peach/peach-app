import { Transaction } from "bitcoinjs-lib";

const MAX_RBF_SEQUENCE = 0xfffffffe;

export const isRBFEnabled = (transaction: Transaction) =>
  transaction.ins.some((v) => v.sequence < MAX_RBF_SEQUENCE);
