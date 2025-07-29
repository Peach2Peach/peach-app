import { useCallback } from "react";
import { shallow } from "zustand/shallow";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import i18n from "../../../utils/i18n";
import { error } from "../../../utils/log/error";
import { isBuyOffer } from "../../../utils/offer/isBuyOffer";
import { useSetToast } from "../../toast/Toast";

export const useHandleMissingPaymentData = () => {
  const navigation = useStackNavigation();
  const setToast = useSetToast();
  const paymentMethods = usePaymentDataStore(
    (state) => Object.values(state.paymentData),
    shallow,
  );

  const openAddPaymentMethodDialog = useCallback(
    (
      offer: BuyOffer | SellOffer,
      currency: Currency,
      paymentMethod: PaymentMethod,
    ) => {
      const existingPaymentMethodsOfType =
        paymentMethods.filter(({ type }) => type === paymentMethod).length + 1;
      const label = `${i18n(`paymentMethod.${paymentMethod}`)} #${existingPaymentMethodsOfType}`;

      navigation.push("paymentMethodForm", {
        paymentData: {
          type: paymentMethod,
          label,
          currencies: [currency],
          country: paymentMethod.startsWith("giftCard.amazon")
            ? (paymentMethod.split(".").pop() as PaymentMethodCountry)
            : undefined,
        },
        origin: isBuyOffer(offer) ? "matchDetails" : "search",
      });
    },
    [navigation, paymentMethods],
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
          label: i18n("PAYMENT_DATA_MISSING.action"),
          iconId: "edit3",
        },
        keepAlive: true,
      });
    },
    [openAddPaymentMethodDialog, setToast],
  );

  return handleMissingPaymentData;
};
