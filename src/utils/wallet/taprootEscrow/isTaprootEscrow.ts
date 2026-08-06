import { address } from "bitcoinjs-lib";
import { getNetwork } from "../getNetwork";

/** escrow version of the MuSig2 taproot escrow */
export const TAPROOT_ESCROW_VERSION: EscrowVersion = 2;

const TAPROOT_WITNESS_VERSION = 1;

export function isTaprootAddress(addressToCheck?: string): boolean {
  if (!addressToCheck) return false;
  try {
    const { version, prefix } = address.fromBech32(addressToCheck);
    return (
      version === TAPROOT_WITNESS_VERSION && prefix === getNetwork().bech32
    );
  } catch {
    return false;
  }
}

/**
 * @description whether the escrow of this contract is released through the
 * interactive MuSig2 taproot flow instead of the legacy release PSBT.
 * The server sets `escrowVersion`, the address check only guards against a
 * response that omits it - a version 2 contract never carries a release PSBT
 */
export const isTaprootEscrowContract = (contract: Contract) =>
  contract.escrowVersion === TAPROOT_ESCROW_VERSION ||
  (!contract.releasePsbt && isTaprootAddress(contract.escrow));

/** @description whether this sell offer funds a MuSig2 taproot escrow */
export const isTaprootEscrowOffer = (sellOffer: SellOffer) =>
  sellOffer.escrowVersion === TAPROOT_ESCROW_VERSION ||
  isTaprootAddress(sellOffer.escrow);
