import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { isBuyOffer } from "../offer/isBuyOffer";
import { peachAPI } from "../peachAPI";
import { isDefined } from "../validation/isDefined";
import { shouldGoToContract } from "./shouldGoToContract";
import {
  shouldGoToContractChat,
  shouldGoToMatchChat,
  shouldGoToTradeRequestChat,
} from "./shouldGoToContractChat";
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
  } else if (shouldGoToContractChat(data)) {
    const { contractId } = data;
    navigationRef.navigate("contractChat", { contractId });
  } else if (shouldGoToTradeRequestChat(data)) {
    const { offerId, requestingUserId } = data;
    navigationRef.navigate("tradeRequestChat", { offerId, requestingUserId });
  } else if (shouldGoToMatchChat(data)) {
    const { offerId, matchingOfferId } = data;
    navigationRef.navigate("matchChat", { offerId, matchingOfferId });
  } else if (shouldGoToYourTradesSell(data)) {
    navigationRef.navigate("homeScreen", {
      screen: "yourTrades",
      params: { tab: "yourTrades.sell" },
    });
  } else if (shouldGoToYourTradesBuy(data)) {
    navigationRef.navigate("homeScreen", {
      screen: "yourTrades",
      params: { tab: "yourTrades.buy" },
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
        navigationRef.navigate("search", { offerId });
      }
    } else {
      navigationRef.navigate("offer", { offerId });
    }
  } else {
    return false;
  }

  return true;
};
