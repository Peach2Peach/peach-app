import { sum } from "../../math/sum";
import { UTXOWithPath } from "../useLiquidWalletState";
import { buildTransaction } from "./buildTransaction";

const TX_SIZE_BUFFER = 10;

type Props = {
  recipients: { address: string; amount: number }[];
  feeRate: number;
  inputs: UTXOWithPath[];
};

export const estimateMiningFees = ({ recipients, feeRate, inputs }: Props) => {
  const maxAmount = inputs.map((utxo) => utxo.value).reduce(sum, 0);
  const stagedTx = buildTransaction({ recipients, inputs });

  const miningFees = Math.ceil(
    (stagedTx.virtualSize() + TX_SIZE_BUFFER) * feeRate,
  );

  return {
    miningFees,
    sendableAmount: maxAmount - miningFees,
  };
};