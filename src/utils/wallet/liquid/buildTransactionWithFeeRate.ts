import { Transaction as LiquidTransaction } from "liquidjs-lib";
import { peachLiquidWallet } from "../setWallet";
import { UTXOWithPath } from "../useLiquidWalletState";
import { buildTransaction } from "./buildTransaction";
import { estimateMiningFees } from "./estimateMiningFees";

type BuildTransactionProps = {
  recipients: { address: string; amount: number }[];
  feeRate?: number;
  inputs: UTXOWithPath[];
};
export const buildTransactionWithFeeRate = ({
  recipients,
  feeRate = 1,
  inputs,
}: BuildTransactionProps): LiquidTransaction => {
  if (!peachLiquidWallet) throw Error("WALLET_NOT_READY");

  const { miningFees } = estimateMiningFees({
    feeRate,
    recipients,
    inputs,
  });

  return buildTransaction({
    recipients,
    miningFees,
    inputs,
  });
};
