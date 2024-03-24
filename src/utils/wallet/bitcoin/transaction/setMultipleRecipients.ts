import { TxBuilder } from "bdk-rn";
import { ScriptAmount } from "bdk-rn/lib/classes/Bindings";
import { getScriptPubKeyFromAddress } from "./getScriptPubKeyFromAddress";

export const setMultipleRecipients = async (
  transaction: TxBuilder,
  amount: number,
  addresses: string[],
) => {
  const splitAmount = Math.floor(amount / addresses.length);
  const recipients = await Promise.all(
    addresses.map(getScriptPubKeyFromAddress),
  );
  await transaction.setRecipients(
    recipients.map((script) => new ScriptAmount(script, splitAmount)),
  );
};
