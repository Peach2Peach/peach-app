import { useCallback } from "react";
import { useStackNavigation } from "../useStackNavigation";
import { useTranslate } from "@tolgee/react";

export const useGetPNActionHandler = () => {
  const navigation = useStackNavigation();
  const { t } = useTranslate("global");
  const getPNActionHandler = useCallback(
    ({ type, contractId, isChat, offerId }: PNData) => {
      if (contractId) {
        if (isChat) {
          return {
            label: t("goToChat"),
            iconId: "arrowLeftCircle",
            onPress: () => navigation.navigate("contractChat", { contractId }),
          };
        }
        return {
          label: t("goToContract"),
          iconId: "arrowLeftCircle",
          onPress: () => navigation.navigate("contract", { contractId }),
        };
      }
      if (offerId && type) {
        if (type === "offer.sellOfferExpired") {
          return {
            label: t("goToOffer"),
            iconId: "arrowLeftCircle",
            onPress: () => navigation.navigate("offer", { offerId }),
          };
        }
        if (type === "offer.matchSeller") {
          return {
            label: t("goToOffer"),
            iconId: "arrowLeftCircle",
            onPress: () => navigation.navigate("search", { offerId }),
          };
        }
        if (type === "offer.matchBuyer") {
          return {
            label: t("goToOffer"),
            iconId: "arrowLeftCircle",
            onPress: () => navigation.navigate("explore", { offerId }),
          };
        }
      }
      return undefined;
    },
    [navigation, t],
  );
  return getPNActionHandler;
};
