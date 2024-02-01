import { Psbt } from "bitcoinjs-lib";
import { SIGHASH } from "../../../utils/bitcoin/constants";

export const isPSBTForBatch = (psbt: Psbt) =>
  psbt.data.inputs.every(
    (input) => input.sighashType === SIGHASH.SINGLE_ANYONECANPAY,
  );
