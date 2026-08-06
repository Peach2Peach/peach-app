import { Network, Transaction, address } from "bitcoinjs-lib";
import { getNetwork } from "../getNetwork";
import { TaprootEscrow } from "./deriveTaprootEscrow";

/**
 * @description verifies that the sighash the server asks us to MuSig2-sign
 * really belongs to the release transaction it sent, and that this transaction
 * spends the escrow funding output and pays the buyer.
 *
 * Without this check the seller would be signing a message chosen by the
 * server, which - as the second key of the 2-of-2 - would be enough to move
 * the escrow anywhere.
 *
 * @throws if anything doesn't line up. Never sign after a throw
 */
export function verifyReleaseTransaction({
  unsignedTx,
  sighash,
  escrow,
  releaseAddress,
  funding,
  network = getNetwork(),
}: {
  /** the unsigned release transaction (hex) */
  unsignedTx: string;
  /** the 32 byte message the server wants signed */
  sighash: Buffer;
  escrow: TaprootEscrow;
  /** the buyer's payout address */
  releaseAddress: string;
  funding: FundingStatus;
  network?: Network;
}) {
  const transaction = Transaction.fromHex(unsignedTx);

  // a MuSig2 session signs exactly one input, more would need more sessions
  if (transaction.ins.length !== 1) {
    throw Error("TAPROOT_RELEASE_UNEXPECTED_INPUT_COUNT");
  }

  const [input] = transaction.ins;
  const inputTxId = Buffer.from(input.hash).reverse().toString("hex");
  const fundingIndex = funding.txIds.findIndex(
    (txId, i) => txId === inputTxId && funding.vouts[i] === input.index,
  );
  if (fundingIndex === -1) throw Error("TAPROOT_RELEASE_UNKNOWN_INPUT");

  const fundingAmount = funding.amounts[fundingIndex];
  if (!fundingAmount) throw Error("TAPROOT_RELEASE_MISSING_FUNDING_AMOUNT");

  const releaseOutputScript = address.toOutputScript(releaseAddress, network);
  const buyerOutput = transaction.outs.find(({ script }) =>
    script.equals(releaseOutputScript),
  );
  if (!buyerOutput) throw Error("TAPROOT_RELEASE_ADDRESS_MISMATCH");
  if (buyerOutput.value <= 0) throw Error("TAPROOT_RELEASE_INVALID_OUTPUT");

  const totalOut = transaction.outs.reduce((sum, { value }) => sum + value, 0);
  if (totalOut > fundingAmount) throw Error("TAPROOT_RELEASE_INVALID_OUTPUT");

  // key path spend, so no leaf hash. SIGHASH_ALL is accepted as well since it
  // signs the exact same set of inputs and outputs as SIGHASH_DEFAULT
  const signsTransaction = [
    Transaction.SIGHASH_DEFAULT,
    Transaction.SIGHASH_ALL,
  ].some((hashType) =>
    transaction
      .hashForWitnessV1(0, [escrow.script], [fundingAmount], hashType)
      .equals(sighash),
  );
  if (!signsTransaction) throw Error("TAPROOT_RELEASE_SIGHASH_MISMATCH");
}
