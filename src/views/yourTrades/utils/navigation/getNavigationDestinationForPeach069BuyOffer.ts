import { OfferSummary } from "../../../../../peach-api/src/@types/offer";

export const getNavigationDestinationForPeach069BuyOffer = ({
  id: offerId,
}: Pick<OfferSummary, "tradeStatus" | "id" | "type">) => {
  return ["browseTradeRequestsToMyBuyOffer", { offerId }] as const;
};
