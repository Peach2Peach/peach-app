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
            iconId: "arrowLeftCircle",
            onPress: () => navigation.navigate("contractChat", { contractId }),
          };
        }
        return {
          label: i18n("goToContract"),
          iconId: "arrowLeftCircle",
          onPress: () => {
            navigation.reset({
              index: 1,
              routes: [
                { name: "homeScreen", params: { screen: "yourTrades" } },
                {
                  name: "contract",
                  params: {
                    contractId: contractId,
                  },
                },
              ],
            });
          },
        };
      }
      if (offerId && type) {
        if (type === "offer.sellOfferExpired") {
          return {
            label: i18n("goToOffer"),
            iconId: "arrowLeftCircle",
            onPress: () => navigation.navigate("offer", { offerId }),
          };
        }
        if (type === "offer.matchSeller") {
          return {
            label: i18n("goToOffer"),
            iconId: "arrowLeftCircle",
            onPress: () => navigation.navigate("search", { offerId }),
          };
        }
        if (type === "offer.matchBuyer") {
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
