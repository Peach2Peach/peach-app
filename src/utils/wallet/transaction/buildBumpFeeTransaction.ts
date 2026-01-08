import { BumpFeeTxBuilder } from "bdk-rn";

export const buildBumpFeeTransaction = async (
  txId: string,
  newFeeRate: number,
) => {
  const bumpFeeTxBuilder = await new BumpFeeTxBuilder().create(
    txId,
    newFeeRate,
  );
  await bumpFeeTxBuilder.enableRbf();

  return bumpFeeTxBuilder;
};
