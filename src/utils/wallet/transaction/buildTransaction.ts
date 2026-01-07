import { NETWORK } from "@env";
import { Address, Amount, FeeRate, LocalOutput, TxBuilder } from "bdk-rn";
import { convertBitcoinNetworkToBDKNetwork } from "../../bitcoin/convertBitcoinNetworkToBDKNetwork";

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
export const buildTransaction = async (args: BuildTxParams) => {
  const txBuilder = buildTransactionBase(args.feeRate);
  console.log("1...");
  if (args?.utxos?.length) {
    console.log("2...");
    txBuilder.addUtxos(args.utxos.map((utxo) => utxo.outpoint));
    console.log("3...");
    txBuilder.manuallySelectedOnly();
    console.log("4...");
  }

  if (!args.address) {
    console.log("0000");
    return txBuilder;
  }

  console.log("5...");

  console.log("args.address", args.address);
  // const recipient = await getScriptPubKeyFromAddress(args.address);
  // console.log("6...", recipient);
  // const recipientSanitized = recipient.replace("bitcoin:", "");
  const recipientAddress = new Address(
    args.address,
    convertBitcoinNetworkToBDKNetwork(NETWORK),
  );
  console.log("7...");
  if (args.shouldDrainWallet) {
    console.log("8...");
    if (args?.utxos?.length) {
      throw Error("HERE!!!");
      txBuilder.manuallySelectedOnly(); //TODO BDK check if this is inplace or not
    } else {
      txBuilder.drainWallet(); //TODO BDK check if this is inplace or not
    }
    return txBuilder.drainTo(recipientAddress.scriptPubkey()); //TODO: CHECK WHY THIS IS NOT IN-PLACE
  } else if (args.address) {
    console.log("9...");
    const amount = Amount.fromSat(BigInt(args.amount));
    return txBuilder.addRecipient(recipientAddress.scriptPubkey(), amount); //TODO: CHECK WHY THIS IS NOT IN-PLACE
  }

  // console.log("10...");

  return txBuilder;
};

function buildTransactionBase(feeRate?: number) {
  const txBuilder = new TxBuilder();
  if (feeRate) {
    const feeRateObj = FeeRate.fromSatPerVb(BigInt(feeRate));
    txBuilder.feeRate(feeRateObj);
  }

  return txBuilder;
}
