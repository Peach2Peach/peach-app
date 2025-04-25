import { ContractSummary } from "../../../../peach-api/src/@types/contract";

export function getOfferData(
  offers: (SellOffer | BuyOffer)[],
  contracts: ContractSummary[],
  type: TransactionType,
) {
  return offers.map((offer) => {
    const contract = contracts.find((c) => c.id === offer.contractId);
    return {
      offerId: offer.id,
      contractId: offer.contractId,
      amount:
        contract?.amount ||
        (Array.isArray(offer.amount) ? offer.amount[0] : offer.amount),
      address:
        offer.type === "bid"
          ? offer.releaseAddress
          : type === "ESCROWFUNDED"
            ? offer.escrow || ""
            : offer.returnAddress,
      currency: contract?.currency,
      price: contract?.price,
    };
  });
}
