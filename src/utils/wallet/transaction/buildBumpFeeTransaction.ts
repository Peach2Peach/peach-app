import { BumpFeeTxBuilder, FeeRate, Txid } from "bdk-rn";

const SAT_PER_VB_TO_SAT_PER_KWU = 250;

export const buildBumpFeeTransaction = (txId: string, newFeeRate: number) =>
  new BumpFeeTxBuilder(
    Txid.fromString(txId),
    FeeRate.fromSatPerKwu(
      BigInt(Math.round(newFeeRate * SAT_PER_VB_TO_SAT_PER_KWU)),
    ),
  );
