import { NETWORK } from "@env";
import { Address } from "bdk-rn";
import { convertBitcoinNetworkToBDKNetwork } from "../../bitcoin/convertBitcoinNetworkToBDKNetwork";

export const getScriptPubKeyFromAddress = async (address: string) => {
  const recipientAddress = new Address(
    address,
    convertBitcoinNetworkToBDKNetwork(NETWORK),
  );

  return recipientAddress.scriptPubkey();
};
