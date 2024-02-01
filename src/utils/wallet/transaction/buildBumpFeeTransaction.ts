import { BumpFeeTxBuilder } from "bdk-rn";

export const buildBumpFeeTransaction = async (
  txId: string,
  newFeeRate: number,
  shrinkForAddress?: string,
) => {
  const bumpFeeTxBuilder = await new BumpFeeTxBuilder().create(
    txId,
    newFeeRate,
  );
  await bumpFeeTxBuilder.enableRbf();

  if (shrinkForAddress) await bumpFeeTxBuilder.allowShrinking(shrinkForAddress);

  return bumpFeeTxBuilder;
};
