import { useState } from "react";
import { useMeetupEvents } from "../../../hooks/query/useMeetupEvents";
import { useGoToOrigin } from "../../../hooks/useGoToOrigin";
import { useRoute } from "../../../hooks/useRoute";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import { useAccountStore } from "../../../utils/account/account";
import { peachAPI } from "../../../utils/peachAPI";
import { signAndEncrypt } from "../../../utils/pgp/signAndEncrypt";
import { usePaymentMethodInfo } from "../../../views/addPaymentMethod/usePaymentMethodInfo";
import { toggleCurrency } from "../../inputs/paymentForms/utils";

export const useMeetupScreenSetup = () => {
  const route = useRoute<"meetupScreen">();
  const { eventId } = route.params;
  const deletable = route.params.deletable ?? false;
  const goToOrigin = useGoToOrigin();
  const { data: meetupEvents } = useMeetupEvents();
  const getPaymentData = usePaymentDataStore((state) => state.getPaymentData);
  const myPgpPubKey = useAccountStore((state) => state.account.pgp.publicKey);

  const publicKey = useAccountStore((state) => state.account.publicKey);
  const event = meetupEvents?.find(({ id }) => id === eventId) || {
    id: eventId,
    longName: "",
    shortName: "",
    currencies: [],
    country: "DE",
    city: "",
    featured: false,
  };

  const [currencyState, setSelectedCurrencies] = useState<Currency[]>();
  const selectedCurrencies = currencyState || event.currencies;
  const onCurrencyToggle = (currency: Currency) => {
    setSelectedCurrencies((prev) => {
      const getNewCurrencies = toggleCurrency(currency);
      const newCurrencies = getNewCurrencies(prev ? prev : event.currencies);
      return newCurrencies;
    });
  };

  const addPaymentData = usePaymentDataStore((state) => state.addPaymentData);

  const selectPaymentMethod = useOfferPreferences(
    (state) => state.selectPaymentMethod,
  );
  const { data: meetupInfo } = usePaymentMethodInfo(`cash.${eventId}`);

  const addToPaymentMethods = () => {
    if (!meetupInfo) return;
    const meetup: PaymentData = {
      id: meetupInfo.id,
      label: event.shortName,
      type: meetupInfo.id,
      userId: publicKey,
      currencies: selectedCurrencies,
      country: event.country,
    };
    addPaymentData(meetup);
    selectPaymentMethod(meetupInfo.id);
    goToOrigin(route.params.origin);

    const newPaymentData = getPaymentData();

    signAndEncrypt(JSON.stringify(newPaymentData), myPgpPubKey).then(
      async ({ signature, encrypted }) => {
        try {
          peachAPI.private.peach069.setEncryptedPaymentDataOnSelfUser69({
            encryptedPaymentData: encrypted,
            encryptedPaymentDataSignature: signature,
          });
        } catch (err) {
          console.error("Failed to send encrypted payment data:", err);
        }
      },
    );
  };

  return {
    paymentMethod: `cash.${event.id}` satisfies PaymentMethod,
    event,
    deletable,
    addToPaymentMethods,
    selectedCurrencies,
    onCurrencyToggle,
  };
};
