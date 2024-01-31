import { Transaction } from "bitcoinjs-lib";

export const SIGHASH = {
  ALL: Transaction.SIGHASH_ALL,
  SINGLE_ANYONECANPAY:
    Transaction.SIGHASH_SINGLE + Transaction.SIGHASH_ANYONECANPAY,
};
