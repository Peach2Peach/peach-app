import { offerIdToHex } from "../offer/offerIdToHex";

export const contractIdToHex = (contractId: Contract["id"]) => {
  const sellOfferId = offerIdToHex(contractId.split("-")[0]).replace("P‑", "");
  const buyOfferId = offerIdToHex(contractId.split("-")[1]).replace("P‑", "");
  return `PC‑${sellOfferId}‑${buyOfferId}`;
};
