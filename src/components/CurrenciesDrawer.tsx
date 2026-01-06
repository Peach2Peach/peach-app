import { useMemo, useState } from "react";
import { View } from "react-native";
import { Currency } from "../../peach-api/src/@types/global";
import tw from "../styles/tailwind";
import i18n, { useI18n } from "../utils/i18n";
import { usePaymentMethods } from "../views/addPaymentMethod/usePaymentMethodInfo";
import { SelectionDrawer } from "./SelectionDrawer";
import { Button } from "./buttons/Button";
import { PeachText } from "./text/PeachText";

interface CurrenciesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrencies: Currency[];
  onToggleCurrency: (currency: Currency) => void;
  currencyOfferAmounts: Partial<Record<Currency, number>>;
  onReset?: () => void;
}

export function CurrenciesDrawer({
  isOpen,
  onClose,
  selectedCurrencies,
  onToggleCurrency,
  currencyOfferAmounts,
  onReset,
}: CurrenciesDrawerProps) {
  useI18n();
  const [searchQuery, setSearchQuery] = useState("");
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
      .map((currency) => {
        const numberOfOffers = currencyOfferAmounts?.[currency] || 0;
        return {
          currency,
          numberOfOffers,
        };
      })
      .sort((a, b) => b.numberOfOffers - a.numberOfOffers) // Sort by offer count descending
      .filter(({ currency }) => {
        const currencyName = `${i18n(`currency.${currency}`)} (${currency})`;
        return currencyName.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map(({ currency, numberOfOffers }) => ({
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
      }));
  }, [
    allCurrencies,
    currencyOfferAmounts,
    selectedCurrencies,
    onToggleCurrency,
    searchQuery,
  ]);

  if (!allCurrencies) return null;

  return (
    <SelectionDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        selectedCurrencies.length > 0 ? (
          <PeachText
            style={tw`text-base font-extrabold tracking-widest text-center uppercase grow font-baloo`}
          >
            {i18n("currencies")}{" "}
            <PeachText
              style={tw`text-base font-normal text-info-main font-baloo`}
            >
              ({selectedCurrencies.length})
            </PeachText>
          </PeachText>
        ) : (
          i18n("currencies")
        )
      }
      items={items}
      type="checkbox"
      showSearch
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      resetButton={
        onReset && (
          <Button
            textColor={tw.color(
              selectedCurrencies.length > 0 ? "success-main" : "black-50",
            )}
            style={tw`py-1 border md:py-2`}
            disabled={selectedCurrencies.length === 0}
            onPress={onReset}
            ghost
          >
            {i18n("resetAll")}
          </Button>
        )
      }
    />
  );
}
