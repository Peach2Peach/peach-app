import { NETWORK } from "@env";
import { Address, type Psbt } from "bdk-rn";
import { isDefined } from "../../validation/isDefined";
import { bdkNetwork } from "../bdkShim";
import { peachWallet } from "../setWallet";

export type TransactionOutput = { address: string; amount: number };

/**
 * Decodes the outputs a psbt actually pays to, dropping the change that comes
 * back to our own wallet. Confirmation screens should use this rather than the
 * values that went into the transaction builder, so that what the user approves
 * is what gets signed.
 *
 * `recipientAddress` is kept even when it belongs to us, so that sending to one
 * of our own addresses still shows the real recipient.
 */
export const getPsbtOutputs = (
  psbt: Psbt,
  recipientAddress?: string,
): TransactionOutput[] =>
  psbt
    .extractTx()
    .output()
    .map((output) => {
      const address = Address.fromScript(
        output.scriptPubkey,
        bdkNetwork(NETWORK),
      ).toString();
      const isChange =
        address !== recipientAddress &&
        !!peachWallet?.wallet?.isMine(output.scriptPubkey);

      return isChange
        ? undefined
        : { address, amount: Number(output.value.toSat()) };
    })
    .filter(isDefined);
