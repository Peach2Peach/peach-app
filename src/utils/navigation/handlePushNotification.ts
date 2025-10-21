import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { isBuyOffer } from "../offer/isBuyOffer";
import { peachAPI } from "../peachAPI";
import { isDefined } from "../validation/isDefined";
import { shouldGoToContract } from "./shouldGoToContract";
import { shouldGoToContractChat } from "./shouldGoToContractChat";
import { shouldGoToSearch } from "./shouldGoToSearch";
import { shouldGoToSell } from "./shouldGoToSell";
import { shouldGoToYourTradesBuy } from "./shouldGoToYourTradesBuy";
import { shouldGoToYourTradesSell } from "./shouldGoToYourTradesSell";

export type StackNavigation = StackNavigationProp<
  RootStackParamList,
  keyof RootStackParamList
>;
export type Navigation =
  | NavigationContainerRefWithCurrent<RootStackParamList>
  | StackNavigation;

export const handlePushNotification = async (
  navigationRef: Navigation,
  { data }: { data: PNData },
) => {
  if (shouldGoToContract(data)) {
    const { contractId } = data;
    navigationRef.navigate("contract", { contractId });
  } else if (
    data.type === "offer.newSellOfferMatchesPreferences" &&
    data.offerId
  ) {
    const { offerId } = data;
    navigationRef.navigate("expressBuyTradeRequest", {
      offerId: offerId,
    });
  } else if (
    data.type === "offer.newBuyOfferMatchesPreferences" &&
    data.offerId
  ) {
    const { offerId } = data;
    navigationRef.navigate("expressSellTradeRequest", {
      offerId: offerId,
    });
  } else if (data.type === "offer.expressFlowTradeRequestChatMessageReceived") {
    const { offerId, offerType, requestingUserId } = data;
    navigationRef.navigate("tradeRequestChat", {
      offerId: offerId!,
      offerType: offerType!,
      requestingUserId: requestingUserId!,
    });
  } else if (data.type === "offer.expressBuyTradeRequestRejected") {
    navigationRef.navigate("expressBuyBrowseSellOffers");
  } else if (data.type === "offer.expressSellTradeRequestRejected") {
    navigationRef.navigate("expressSellBrowseBuyOffers");
  } else if (
    data.type === "contract.escrowFundingTimeExpired.buyer" &&
    data.contractId
  ) {
    navigationRef.navigate("contract", { contractId: data.contractId });
  } else if (
    data.type === "contract.escrowFundingTimeExpired.seller" &&
    data.contractId
  ) {
    navigationRef.navigate("contract", { contractId: data.contractId });
  } else if (
    data.type === "contract.escrowFundingTimeExpiring6hLeft" &&
    data.contractId
  ) {
    navigationRef.navigate("contract", { contractId: data.contractId });
  } else if (
    data.type === "contract.escrowFundingTimeExpiring1hLeft" &&
    data.contractId
  ) {
    navigationRef.navigate("contract", { contractId: data.contractId });
  } else if (shouldGoToContractChat(data)) {
    const { contractId } = data;
    navigationRef.navigate("contractChat", { contractId });
  } else if (shouldGoToYourTradesSell(data)) {
    navigationRef.navigate("homeScreen", {
      screen: "yourTrades",
      params: { tab: "yourTrades.sell" },
    });
  } else if (shouldGoToYourTradesBuy(data)) {
    navigationRef.navigate("homeScreen", {
      screen: "yourTrades",
      params: { tab: "yourTrades.69BuyOffer" },
    });
  } else if (
    data.type === "offer.expressBuyTradeRequestReceived" &&
    data.offerId
  ) {
    navigationRef.navigate("browseTradeRequestsToMySellOffer", {
      offerId: data.offerId,
    });
  } else if (data.type === "contract.escrowFunded.buyer" && data.contractId) {
    navigationRef.navigate("contract", {
      contractId: data.contractId,
    });
  } else if (data.type === "contract.escrowFunded" && data.contractId) {
    navigationRef.navigate("contract", {
      contractId: data.contractId,
    });
  } else if (
    data.type === "offer.expressSellTradeRequestReceived" &&
    data.offerId
  ) {
    navigationRef.navigate("browseTradeRequestsToMyBuyOffer", {
      offerId: data.offerId,
    });
  } else if (shouldGoToSell(data)) {
    navigationRef.navigate("homeScreen", { screen: "home" });
  } else if (isDefined(data.offerId)) {
    const { result: offer } = await peachAPI.private.offer.getOfferDetails({
      offerId: data.offerId,
    });
    const { offerId } = data;
    if (
      shouldGoToSearch(
        data.type,
        !!(offer?.matches && offer.matches.length > 0),
      )
    ) {
      if (offer && isBuyOffer(offer)) {
        navigationRef.navigate("explore", { offerId });
      } else {
        navigationRef.navigate("browseTradeRequestsToMySellOffer", { offerId }); // TODO: CHECK IF CORRECT
      }
    } else {
      navigationRef.navigate("offer", { offerId });
    }
  } else {
    return false;
  }

  return true;
};
