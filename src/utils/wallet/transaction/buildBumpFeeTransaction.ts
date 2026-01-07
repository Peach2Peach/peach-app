import { BumpFeeTxBuilder, FeeRate, Txid } from "bdk-rn";

export const buildBumpFeeTransaction = async (
  txId: string,
  newFeeRate: number,
  shrinkForAddress?: string,
) => {
  const bumpFeeTxBuilder = new BumpFeeTxBuilder(
    Txid.fromString(txId),
    FeeRate.fromSatPerVb(BigInt(newFeeRate)),
  );

  // TODO BDK: bdk team said this was bug prone so they removed it
  // if (shrinkForAddress)  bumpFeeTxBuilder.allowShrinking(shrinkForAddress);

  return bumpFeeTxBuilder;
};
