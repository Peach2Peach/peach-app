import { useCallback } from "react";
import i18n from "../../utils/i18n";
import { useNavigation } from "../useNavigation";

const offerSummaryEvents = [
  "offer.notFunded",
  "offer.sellOfferExpired",
  "offer.buyOfferExpired",
];
const searchEvents = ["offer.matchSeller"];
const exploreEvents = ["offer.matchBuyer"];

export const useGetPNActionHandler = () => {
  const navigation = useNavigation();
  const getPNActionHandler = useCallback(
    ({ type, contractId, isChat, offerId }: PNData) => {
      if (contractId) {
        if (isChat) {
          return {
            label: i18n("goToChat"),
            iconId: "arrowLeftCircle",
            onPress: () => navigation.navigate("contractChat", { contractId }),
          };
        }
        return {
          label: i18n("goToContract"),
          iconId: "arrowLeftCircle",
          onPress: () => navigation.navigate("contract", { contractId }),
        };
      }
      if (offerId && type) {
        if (offerSummaryEvents.includes(type)) {
          return {
            label: i18n("goToOffer"),
            iconId: "arrowLeftCircle",
            onPress: () => navigation.navigate("offer", { offerId }),
          };
        }
        if (searchEvents.includes(type)) {
          return {
            label: i18n("goToOffer"),
            iconId: "arrowLeftCircle",
            onPress: () => navigation.navigate("search", { offerId }),
          };
        }
        if (exploreEvents.includes(type)) {
          return {
            label: i18n("goToOffer"),
            iconId: "arrowLeftCircle",
            onPress: () => navigation.navigate("explore", { offerId }),
          };
        }
      }
      return undefined;
    },
    [navigation],
  );
  return getPNActionHandler;
};
