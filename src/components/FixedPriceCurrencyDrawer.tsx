import { useMemo, useState } from "react";
import tw from "../styles/tailwind";
import i18n, { useI18n } from "../utils/i18n";
import { usePaymentMethods } from "../views/addPaymentMethod/usePaymentMethodInfo";
import { SelectionDrawer } from "./SelectionDrawer";
import { PeachText } from "./text/PeachText";

/** shown at the top when no payment method currencies are selected */
const DEFAULT_TOP_CURRENCIES: Currency[] = ["EUR", "CHF", "GBP", "USD"];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: Currency;
  onSelectCurrency: (currency: Currency) => void;
  /** currencies of the currently selected payment methods; shown on top */
  preferredCurrencies?: Currency[];
};

export function FixedPriceCurrencyDrawer({
  isOpen,
  onClose,
  selectedCurrency,
  onSelectCurrency,
  preferredCurrencies = [],
}: Props) {
  useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: paymentMethods } = usePaymentMethods();

  // payment methods carry peach-api's wider Currency union (it still lists
  // discontinued currencies); narrow to the app's list, which is what the
  // offer preferences store and the rest of the app work with.
  const allCurrencies = useMemo(
    () =>
      paymentMethods
        ? (Array.from(
            new Set(paymentMethods.flatMap((info) => info.currencies)),
          ) as Currency[])
        : undefined,
    [paymentMethods],
  );

  const orderedCurrencies = useMemo(() => {
    if (!allCurrencies) return [];
    const top = (
      preferredCurrencies.length > 0
        ? preferredCurrencies
        : DEFAULT_TOP_CURRENCIES
    ).filter((currency) => allCurrencies.includes(currency));

    return [
      ...top,
      ...allCurrencies.filter((currency) => !top.includes(currency)),
    ];
  }, [allCurrencies, preferredCurrencies]);

  const items = useMemo(
    () =>
      orderedCurrencies
        .filter((currency) =>
          `${i18n(`currency.${currency}`)} (${currency})`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
        .map((currency) => ({
          text: (
            <PeachText style={tw`input-title shrink`}>
              {`${i18n(`currency.${currency}`)} (${currency})`}
            </PeachText>
          ),
          onPress: () => {
            onSelectCurrency(currency);
            onClose();
          },
          isSelected: currency === selectedCurrency,
        })),
    [orderedCurrencies, searchQuery, selectedCurrency, onSelectCurrency, onClose],
  );

  if (!allCurrencies) return null;

  return (
    <SelectionDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={i18n("currency")}
      items={items}
      type="radioButton"
      showSearch
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      includeFilterAlertToggle={false}
    />
  );
}
