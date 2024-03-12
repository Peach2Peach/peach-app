import { sum } from "../../math/sum";
import { peachLiquidWallet } from "../setWallet";
import { UTXOWithPath } from "../useLiquidWalletState";
import { buildTransaction } from "./buildTransaction";

const TX_SIZE_BUFFER = 10;

type Props = {
  feeRate: number;
  inputs: UTXOWithPath[];
  amount: number;
};

/** @description this method assumes one recipient address only */
export const estimateMiningFees = ({ feeRate, inputs, amount }: Props) => {
  if (!peachLiquidWallet) throw Error("WALLET_NOT_READY");
  const maxAmount = inputs.map((utxo) => utxo.value).reduce(sum, 0);
  const stagedTx = buildTransaction({
    recipient: peachLiquidWallet.getAddress(0).address,
    amount,
    inputs,
  });

  const miningFees = Math.ceil(
    (stagedTx.virtualSize() + TX_SIZE_BUFFER) * feeRate,
  );

  return {
    miningFees,
    sendableAmount: maxAmount - miningFees,
  };
};
