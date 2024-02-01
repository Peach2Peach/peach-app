import { Address } from "bdk-rn";

export const getScriptPubKeyFromAddress = async (address: string) => {
  const recipientAddress = await new Address().create(address);
  return recipientAddress.scriptPubKey();
};
