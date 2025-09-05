import { useMemo } from "react";
import { View } from "react-native";
import { Currency } from "../../peach-api/src/@types/global";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { usePaymentMethods } from "../views/addPaymentMethod/usePaymentMethodInfo";
import { SelectionDrawer } from "./SelectionDrawer";
import { PeachText } from "./text/PeachText";

interface CurrenciesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrencies: Currency[];
  onToggleCurrency: (currency: Currency) => void;
  currencyOfferAmounts: Record<Currency, number>;
}

export function CurrenciesDrawer({
  isOpen,
  onClose,
  selectedCurrencies,
  onToggleCurrency,
  currencyOfferAmounts,
}: CurrenciesDrawerProps) {
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
      .map((currency) => {
        const numberOfOffers = currencyOfferAmounts?.[currency] || 0;
        return {
          text: (
            <View style={tw`flex-row items-center gap-6px shrink`}>
              <PeachText style={tw`input-title shrink`}>
                {`${i18n(`currency.${currency}`)} (${currency})`}
              </PeachText>
              <PeachText style={tw`body-m text-black-50 shrink`}>
                ({numberOfOffers} offer{numberOfOffers === 1 ? "" : "s"})
              </PeachText>
            </View>
          ),
          onPress: () => onToggleCurrency(currency),
          isSelected: selectedCurrencies.includes(currency),
        };
      });
  }, [
    allCurrencies,
    currencyOfferAmounts,
    selectedCurrencies,
    onToggleCurrency,
  ]);

  if (!allCurrencies) return null;

  return (
    <SelectionDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        selectedCurrencies.length > 0
          ? `${i18n("currencies")} (${selectedCurrencies.length})`
          : i18n("currencies")
      }
      items={items}
      type="checkbox"
    />
  );
}
