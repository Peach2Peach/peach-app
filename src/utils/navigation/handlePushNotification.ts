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
    navigationRef.navigateDeprecated("contract", { contractId });
  } else if (shouldGoToContractChat(data)) {
    const { contractId } = data;
    navigationRef.navigateDeprecated("contractChat", { contractId });
  } else if (shouldGoToYourTradesSell(data)) {
    navigationRef.navigateDeprecated("homeScreen", {
      screen: "yourTrades",
      params: { tab: "yourTrades.sell" },
    });
  } else if (shouldGoToYourTradesBuy(data)) {
    navigationRef.navigateDeprecated("homeScreen", {
      screen: "yourTrades",
      params: { tab: "yourTrades.buy" },
    });
  } else if (shouldGoToSell(data)) {
    navigationRef.navigateDeprecated("homeScreen", { screen: "home" });
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
        navigationRef.navigateDeprecated("explore", { offerId });
      } else {
        navigationRef.navigateDeprecated("search", { offerId });
      }
    } else {
      navigationRef.navigateDeprecated("offer", { offerId });
    }
  } else {
    return false;
  }

  return true;
};
