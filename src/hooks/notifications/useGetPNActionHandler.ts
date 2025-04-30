import { useCallback } from "react";
import i18n from "../../utils/i18n";
import { useStackNavigation } from "../useStackNavigation";

export const useGetPNActionHandler = () => {
  const navigation = useStackNavigation();
  const getPNActionHandler = useCallback(
    ({ type, contractId, isChat, offerId }: PNData) => {
      if (contractId) {
        if (isChat) {
          return {
            label: i18n("goToChat"),
            iconId: "arrowLeftCircle" as const,
            onPress: () =>
              navigation.navigateDeprecated("contractChat", { contractId }),
          };
        }
        return {
          label: i18n("goToContract"),
          iconId: "arrowLeftCircle" as const,
          onPress: () =>
            navigation.navigateDeprecated("contract", { contractId }),
        };
      }
      if (offerId && type) {
        if (type === "offer.sellOfferExpired") {
          return {
            label: i18n("goToOffer"),
            iconId: "arrowLeftCircle" as const,
            onPress: () => navigation.navigateDeprecated("offer", { offerId }),
          };
        }
        if (type === "offer.matchSeller") {
          return {
            label: i18n("goToOffer"),
            iconId: "arrowLeftCircle" as const,
            onPress: () => navigation.navigateDeprecated("search", { offerId }),
          };
        }
        if (type === "offer.matchBuyer") {
          return {
            label: i18n("goToOffer"),
            iconId: "arrowLeftCircle" as const,
            onPress: () =>
              navigation.navigateDeprecated("explore", { offerId }),
          };
        }
      }
      return undefined;
    },
    [navigation],
  );
  return getPNActionHandler;
};
