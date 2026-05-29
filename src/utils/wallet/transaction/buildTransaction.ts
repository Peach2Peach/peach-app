import { Amount, FeeRate, TxBuilder } from "bdk-rn";
import type { LocalOutput, TxBuilderInterface } from "bdk-rn";
import { getScriptPubKeyFromAddress } from "./getScriptPubKeyFromAddress";

const SAT_PER_VB_TO_SAT_PER_KWU = 250;

export type BuildTxParams = {
  address?: string;
  feeRate?: number;
  utxos?: LocalOutput[];
} & (
  | {
      amount: number;
      shouldDrainWallet?: boolean;
    }
  | {
      address?: string;
      shouldDrainWallet: true;
    }
  | {
      address?: undefined;
    }
);

export const buildTransaction = async (
  args: BuildTxParams,
): Promise<TxBuilderInterface> => {
  let txBuilder: TxBuilderInterface = new TxBuilder();
  if (args.feeRate) {
    txBuilder = txBuilder.feeRate(
      FeeRate.fromSatPerKwu(
        BigInt(Math.round(args.feeRate * SAT_PER_VB_TO_SAT_PER_KWU)),
      ),
    );
  }

  if (args?.utxos?.length) {
    txBuilder = txBuilder.addUtxos(args.utxos.map((utxo) => utxo.outpoint));
    txBuilder = txBuilder.manuallySelectedOnly();
  }

  if (!args.address) return txBuilder;

  const recipient = getScriptPubKeyFromAddress(args.address);
  if ("shouldDrainWallet" in args && args.shouldDrainWallet) {
    if (args?.utxos?.length) {
      txBuilder = txBuilder.manuallySelectedOnly();
    } else {
      txBuilder = txBuilder.drainWallet();
    }
    txBuilder = txBuilder.drainTo(recipient);
  } else if ("amount" in args && args.amount !== undefined) {
    txBuilder = txBuilder.addRecipient(
      recipient,
      Amount.fromSat(BigInt(args.amount)),
    );
  }

  return txBuilder;
};
