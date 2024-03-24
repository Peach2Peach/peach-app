import { Transaction } from "bitcoinjs-lib";
import { Transaction as LiquidTransaction } from "liquidjs-lib";

const MAX_RBF_SEQUENCE = 0xfffffffe;

export const isRBFEnabled = (transaction: Transaction | LiquidTransaction) =>
  transaction.ins.some((v) => v.sequence < MAX_RBF_SEQUENCE);
