import { useCallback } from "react";
import i18n from "../../utils/i18n";
import { useStackNavigation } from "../useStackNavigation";

export const useGetPNActionHandler = () => {
  const navigation = useStackNavigation();
  const getPNActionHandler = useCallback(
    ({ type, contractId, isChat, offerId, mobileActionId }: PNData) => {
      if (type && mobileActionId) {
        const goToAction = {
          label: i18n("goToAction"),
          iconId: "arrowLeftCircle" as const,
        };
        if (type === "user.mobileAction.fundEscrow.created") {
          return {
            ...goToAction,
            onPress: () =>
              navigation.navigate("mobilePendingActionFundEscrow", {
                id: mobileActionId,
              }),
          };
        }
        if (type === "user.mobileAction.fundContractEscrow.created") {
          return {
            ...goToAction,
            onPress: () =>
              navigation.navigate("mobilePendingActionFundContractEscrow", {
                id: mobileActionId,
              }),
          };
        }
        if (type === "user.mobileAction.fundMultipleEscrow.created") {
          return {
            ...goToAction,
            onPress: () =>
              navigation.navigate("mobilePendingActionFundMultipleEscrow", {
                id: mobileActionId,
              }),
          };
        }
        if (type === "user.mobileAction.confirmPaymentBuyer.created") {
          return {
            ...goToAction,
            onPress: () =>
              navigation.navigate("mobilePendingActionRevealAddress", {
                id: mobileActionId,
              }),
          };
        }
        if (type === "user.mobileAction.signContractRelease.created") {
          return {
            ...goToAction,
            onPress: () =>
              navigation.navigate("mobilePendingActionSignMultisig", {
                id: mobileActionId,
              }),
          };
        }
        if (type === "user.mobileAction.signEscrowRefund.created") {
          return {
            ...goToAction,
            onPress: () =>
              navigation.navigate("mobilePendingActionRefund", {
                id: mobileActionId,
              }),
          };
        }
        if (type === "user.mobileAction.signEscrowContractRefund.created") {
          return {
            ...goToAction,
            onPress: () =>
              navigation.navigate("mobilePendingActionRefundContractEscrow", {
                id: mobileActionId,
              }),
          };
        }
      }
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
        // peach 69
        if (type === "offer.expressSellTradeRequestReceived") {
          return {
            label: i18n("goToOffer"),
            iconId: "arrowLeftCircle",
            onPress: () =>
              navigation.navigate("browseTradeRequestsToMyBuyOffer", {
                offerId,
              }),
          };
        }
        if (type === "offer.expressBuyTradeRequestReceived") {
          return {
            label: i18n("goToOffer"),
            iconId: "arrowLeftCircle",
            onPress: () =>
              navigation.navigate("browseTradeRequestsToMySellOffer", {
                offerId,
              }),
          };
        }
      }
      return undefined;
    },
    [navigation],
  );
  return getPNActionHandler;
};
