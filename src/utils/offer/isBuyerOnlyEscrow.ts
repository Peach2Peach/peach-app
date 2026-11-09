const BUYER_ONLY_ESCROW_VERSION = 3;

/**
 * @description escrowVersion 3 is the single-sig taproot escrow of a contract
 * created from a Buy Offer. Its key is the Buy Offer's, so the buyer signs the
 * release and the refund, and the seller can neither sign nor republish.
 */
export const isBuyerOnlyEscrow = (
  offerOrContract?: { escrowVersion?: number } | null,
) => offerOrContract?.escrowVersion === BUYER_ONLY_ESCROW_VERSION;
