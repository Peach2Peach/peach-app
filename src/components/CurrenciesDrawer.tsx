import { useMemo } from "react";
import { Currency } from "../../peach-api/src/@types/global";
import i18n from "../utils/i18n";
import { usePaymentMethods } from "../views/addPaymentMethod/usePaymentMethodInfo";
import { SelectionDrawer } from "./SelectionDrawer";

interface CurrenciesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrencies: Currency[];
  onToggleCurrency: (currency: Currency) => void;
}

export function CurrenciesDrawer({
  isOpen,
  onClose,
  selectedCurrencies,
  onToggleCurrency,
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
      .map((currency) => ({
        text: `${i18n(`currency.${currency}`)} (${currency})`,
        onPress: () => onToggleCurrency(currency),
        isSelected: selectedCurrencies.includes(currency),
      }));
  }, [allCurrencies, selectedCurrencies, onToggleCurrency]);

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
