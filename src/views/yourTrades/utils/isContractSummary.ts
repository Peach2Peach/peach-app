import { ContractSummary } from "../../../../peach-api/src/@types/contract";
import { OfferSummary } from "../../../../peach-api/src/@types/offer";

export const isContractSummary = (
  trade:
    | Pick<ContractSummary, "price" | "currency">
    | Partial<OfferSummary>
    | BuyOffer
    | SellOffer,
): trade is ContractSummary => "price" in trade && "currency" in trade;
