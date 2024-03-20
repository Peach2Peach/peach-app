import { useTranslate } from "@tolgee/react";
import { useCallback } from "react";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { error } from "../../../utils/log/error";
import { isBuyOffer } from "../../../utils/offer/isBuyOffer";
import { useSetToast } from "../../toast/Toast";

export const useHandleMissingPaymentData = () => {
  const navigation = useStackNavigation();
  const setToast = useSetToast();
  const getAllPaymentDataByType = usePaymentDataStore(
    (state) => state.getAllPaymentDataByType,
  );
  const { t } = useTranslate("paymentMethod");

  const openAddPaymentMethodDialog = useCallback(
    (
      offer: BuyOffer | SellOffer,
      currency: Currency,
      paymentMethod: PaymentMethod,
    ) => {
      const existingPaymentMethodsOfType =
        getAllPaymentDataByType(paymentMethod).length + 1;
      // @ts-ignore
      const label = `${t(`paymentMethod.${paymentMethod}`)} #${existingPaymentMethodsOfType}`;

      navigation.push("paymentMethodForm", {
        paymentData: {
          type: paymentMethod,
          label,
          currencies: [currency],
          country: /giftCard/u.test(paymentMethod)
            ? (paymentMethod.split(".").pop() as PaymentMethodCountry)
            : undefined,
        },
        origin: isBuyOffer(offer) ? "matchDetails" : "search",
      });
    },
    [getAllPaymentDataByType, navigation, t],
  );

  const handleMissingPaymentData = useCallback(
    (
      offer: BuyOffer | SellOffer,
      currency: Currency,
      paymentMethod: PaymentMethod,
    ) => {
      error("Payment data could not be found for offer", offer.id);

      setToast({
        msgKey: "PAYMENT_DATA_MISSING",
        color: "red",
        action: {
          onPress: () =>
            openAddPaymentMethodDialog(offer, currency, paymentMethod),
          label: t("PAYMENT_DATA_MISSING.action", { ns: "error" }),
          iconId: "edit3",
        },
        keepAlive: true,
      });
    },
    [openAddPaymentMethodDialog, setToast, t],
  );

  return handleMissingPaymentData;
};
