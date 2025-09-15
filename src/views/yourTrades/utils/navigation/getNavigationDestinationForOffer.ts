import { OfferSummary } from "../../../../../peach-api/src/@types/offer";
import { shouldGoToSearch } from "./shouldGoToSearch";
import { shouldGoToWrongFundingAmount } from "./shouldGoToWrongFundingAmount";

export const getNavigationDestinationForOffer = ({
  tradeStatus,
  id: offerId,
  type,
}: Pick<OfferSummary, "tradeStatus" | "id" | "type">) => {
  if (tradeStatus === "offerCanceled") {
    return ["offer", { offerId }] as const;
  }

  if (["fundEscrow", "escrowWaitingForConfirmation"].includes(tradeStatus))
    return ["fundEscrow", { offerId }] as const;
  if (shouldGoToSearch(tradeStatus)) {
    if (type === "bid") return ["explore", { offerId }] as const;
    return ["browseTradeRequestsToMySellOffer", { offerId }] as const;
  }
  if (shouldGoToWrongFundingAmount(tradeStatus))
    return ["wrongFundingAmount", { offerId }] as const;

  return ["homeScreen", { screen: "yourTrades" }] as const;
};
