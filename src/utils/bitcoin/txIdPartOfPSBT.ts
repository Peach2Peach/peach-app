import { Psbt } from "bitcoinjs-lib";
import { Psbt as LiquidPsbt } from "liquidjs-lib/src/psbt";
import { reverseBuffer } from "../crypto/reverseBuffer";

export const txIdPartOfPSBT = (txId: string, psbt: Psbt | LiquidPsbt) =>
  psbt.txInputs.some(
    (input) => txId === reverseBuffer(Buffer.from(input.hash)).toString("hex"),
  );
