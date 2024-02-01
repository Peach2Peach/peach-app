export const shouldGoToSearch = (
  messageType: PNData["type"],
  hasMatches: boolean,
) =>
  messageType === "offer.matchBuyer" ||
  messageType === "offer.matchSeller" ||
  (messageType === "offer.escrowFunded" && hasMatches);
