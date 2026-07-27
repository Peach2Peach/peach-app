/**
 * Liquid offers are flagged by the server as `escrowType`. `chain` is the
 * locally-drafted equivalent, kept as a fallback for the window between
 * publishing an offer and the server's version of it landing in the cache.
 */
export const isLiquidOffer = (
  offer?: Pick<SellOffer, "escrowType" | "chain"> | null,
) => offer?.escrowType === "liquid" || offer?.chain === "liquid";
