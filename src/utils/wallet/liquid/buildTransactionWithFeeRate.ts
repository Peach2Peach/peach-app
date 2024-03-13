import { Transaction as LiquidTransaction } from "liquidjs-lib";
import { sum } from "../../math/sum";
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

  const { miningFees, sendableAmount } = estimateMiningFees({
    feeRate,
    recipients,
    inputs,
  });

  const amountToSend = recipients
    .map((recipient) => recipient.amount)
    .reduce(sum, 0);

  if (recipients.length === 1 && sendableAmount < amountToSend) {
    return buildTransaction({
      recipients: [{ ...recipients[0], amount: sendableAmount }],
      miningFees,
      inputs,
    });
  }
  return buildTransaction({
    recipients,
    miningFees,
    inputs,
  });
};
