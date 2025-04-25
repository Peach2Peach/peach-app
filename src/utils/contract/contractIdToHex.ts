import { offerIdToHex } from "../offer/offerIdToHex";

export const contractIdToHex = (contractId: string) => {
  const [sellOfferId, buyOfferId] = contractId
    .split("-")
    .map((id) => offerIdToHex(id).replace("P‑", ""));
  return `PC‑${sellOfferId}‑${buyOfferId}`;
};
