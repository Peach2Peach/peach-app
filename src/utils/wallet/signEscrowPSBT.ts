import { PsbtInput } from "bip174/src/lib/interfaces";
import { BIP32Interface } from "bip32";
import { Psbt } from "bitcoinjs-lib";
import { signAndFinalizePSBT } from "../bitcoin/signAndFinalizePSBT";
import { isSingleSigEscrow } from "../offer/isSingleSigEscrow";
import { signPSBT } from "./signPSBT";
import {
  getTweakedEscrowSigner,
  signSingleSigEscrowInput,
} from "./singleSigEscrow";

/** the escrow version is carried by the pending action payload itself, so the
 * offer no longer has to be looked up to know which flow applies */
export type RefundPendingActionPayload = {
  refundPSBT: string;
  derivationPathVersion?: number;
  escrowVersion?: number;
};

export type ReleasePendingActionPayload = {
  releasePsbt: string;
  /** never sent for escrowVersion 2 - batching needs Peach to co-sign */
  batchReleasePsbt?: string;
  escrowVersion?: number;
};

/**
 * @description signs a PSBT Peach built and returns one signature per input:
 * a 64 byte schnorr signature over the taproot key path for a single-sig
 * escrow, or our half of the 2-of-2 for a legacy one.
 *
 * The PSBT is signed exactly as received - a taproot signature commits to
 * `nSequence`, so altering or rebuilding the transaction produces a signature
 * the server cannot match against the PSBT it built.
 */
export const signEscrowPSBT = (
  psbt: Psbt,
  wallet: BIP32Interface,
  { escrowVersion }: { escrowVersion?: number },
): string[] => {
  if (isSingleSigEscrow({ escrowVersion })) {
    return psbt.data.inputs.map((_input, index) =>
      signSingleSigEscrowInput(psbt, index, wallet).toString("hex"),
    );
  }

  signPSBT(psbt, wallet);
  return psbt.data.inputs.map(getLastPartialSignature);
};

function getLastPartialSignature(input: PsbtInput) {
  const numberOfSignatures = input.partialSig?.length;
  if (!input.partialSig || !numberOfSignatures) {
    throw Error("signatures missing");
  }
  return input.partialSig[numberOfSignatures - 1].signature.toString("hex");
}

/**
 * @description signs and finalizes a PSBT Peach built and returns the
 * transaction ready to be submitted. A single-sig escrow is a taproot key path
 * spend our signature completes on its own; a legacy escrow needs the P2WSH
 * finalizer that combines our signature with Peach's.
 */
export const signAndFinalizeEscrowPSBT = (
  psbt: Psbt,
  wallet: BIP32Interface,
  { escrowVersion }: { escrowVersion?: number },
) => {
  if (!isSingleSigEscrow({ escrowVersion })) {
    return signAndFinalizePSBT(psbt, wallet).extractTransaction();
  }

  const signer = getTweakedEscrowSigner(wallet);
  psbt.txInputs.forEach((_input, index) => {
    psbt.signInput(index, signer).finalizeInput(index);
  });
  return psbt.extractTransaction();
};
