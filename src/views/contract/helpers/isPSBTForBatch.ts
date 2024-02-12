import { Psbt } from "bitcoinjs-lib";
import { Psbt as LiquidPsbt } from "liquidjs-lib/src/psbt";
import { SIGHASH } from "../../../utils/bitcoin/constants";

export const isPSBTForBatch = (psbt: Psbt |LiquidPsbt) =>
  psbt.data.inputs.every(
    (input) => input.sighashType === SIGHASH.SINGLE_ANYONECANPAY,
  );
