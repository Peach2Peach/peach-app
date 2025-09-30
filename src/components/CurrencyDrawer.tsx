import { useMemo } from "react";
import { shallow } from "zustand/shallow";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { usePaymentMethods } from "../views/addPaymentMethod/usePaymentMethodInfo";
import { SelectionDrawer } from "./SelectionDrawer";
import { PeachText } from "./text/PeachText";

interface CurrencyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CurrencyDrawer({ isOpen, onClose }: CurrencyDrawerProps) {
  const [displayCurrency, setDisplayCurrency] = useSettingsStore(
    (state) => [state.displayCurrency, state.setDisplayCurrency],
    shallow,
  );

  const { data: paymentMethods } = usePaymentMethods();
  const allCurrencies = useMemo(
    () =>
      paymentMethods
        ? Array.from(new Set(paymentMethods.flatMap((info) => info.currencies)))
        : undefined,
    [paymentMethods],
  );

  const items = useMemo(() => {
    if (!allCurrencies) return [];

    return allCurrencies
      .sort((a, b) =>
        i18n(`currency.${a}`).localeCompare(i18n(`currency.${b}`)),
      )
      .map((currency) => ({
        text: (
          <PeachText
            style={tw`input-title`}
          >{`${i18n(`currency.${currency}`)} (${currency})`}</PeachText>
        ),
        onPress: () => setDisplayCurrency(currency),
        isSelected: currency === displayCurrency,
      }));
  }, [allCurrencies, displayCurrency, setDisplayCurrency]);

  if (!allCurrencies) return null;

  return (
    <SelectionDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={i18n("currencies")}
      items={items}
    />
  );
}
