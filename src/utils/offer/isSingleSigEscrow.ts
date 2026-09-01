import { ESCROW_VERSION } from "../../../peach-api";

/**
 * @description escrowVersion 2 is the single-sig taproot escrow the seller owns
 * alone. Anything else (0, 1 or absent) is a legacy 2-of-2 P2WSH escrow shared
 * with Peach and has to keep using the legacy PSBT flows.
 */
export const isSingleSigEscrow = (
  offerOrContract?: { escrowVersion?: number } | null,
) => offerOrContract?.escrowVersion === ESCROW_VERSION;
