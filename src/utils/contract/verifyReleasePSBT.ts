import { Psbt } from "bitcoinjs-lib";
import { txIdPartOfPSBT } from "../bitcoin/txIdPartOfPSBT";
import { normalizeAddress } from "./verifyBuyerReleaseAddress";

/**
 * @description checks a release PSBT built by Peach spends the escrow funding
 * and pays the buyer's release address before the seller signs it. Without a
 * release address only the inputs are checked.
 */
export function verifyReleasePSBT(
  psbt: Psbt,
  txIds: string[],
  releaseAddress?: string,
) {
  if (txIds.length === 0) throw Error("MISSING_DATA");

  if (!txIds.every((txId) => txIdPartOfPSBT(txId, psbt))) {
    throw Error("INVALID_INPUT");
  }

  if (!releaseAddress) return;

  const expected = normalizeAddress(releaseAddress);
  const buyerOutput = psbt.txOutputs.find(
    ({ address }) => !!address && normalizeAddress(address) === expected,
  );
  if (!buyerOutput) throw Error("RETURN_ADDRESS_MISMATCH");
  if (buyerOutput.value === 0) throw Error("INVALID_OUTPUT");
}
