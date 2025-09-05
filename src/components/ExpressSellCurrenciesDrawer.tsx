import { Currency } from "../../peach-api/src/@types/global";
import { useOfferPreferences } from "../store/offerPreferenes";
import { CurrenciesDrawer } from "./CurrenciesDrawer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpressSellCurrenciesDrawer({ isOpen, onClose }: Props) {
  const selectedCurrencies = useOfferPreferences(
    (state) => state.expressSellFilterByCurrencyList,
  );
  const setExpressSellFilterByCurrencyList = useOfferPreferences(
    (state) => state.setExpressSellFilterByCurrencyList,
  );

  const handleToggleCurrency = (currency: Currency) => {
    const isSelected = selectedCurrencies.includes(currency);
    if (isSelected) {
      setExpressSellFilterByCurrencyList(
        selectedCurrencies.filter((c) => c !== currency),
      );
    } else {
      setExpressSellFilterByCurrencyList([...selectedCurrencies, currency]);
    }
  };
  return (
    <CurrenciesDrawer
      isOpen={isOpen}
      onClose={onClose}
      selectedCurrencies={selectedCurrencies}
      onToggleCurrency={handleToggleCurrency}
    />
  );
}
