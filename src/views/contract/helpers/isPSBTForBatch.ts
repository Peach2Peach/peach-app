import { PsbtInput as LiquidPsbtInput } from "bip174-liquid/src/lib/interfaces";
import { PsbtInput } from "bip174/src/lib/interfaces";
import { Psbt } from "bitcoinjs-lib";
import { Psbt as LiquidPsbt } from "liquidjs-lib/src/psbt";
import { SIGHASH } from "../../../utils/bitcoin/constants";

export const isPSBTForBatch = (psbt: Psbt | LiquidPsbt) =>
  psbt.data.inputs.every(
    (input: LiquidPsbtInput | PsbtInput) =>
      input.sighashType === SIGHASH.SINGLE_ANYONECANPAY,
  );
