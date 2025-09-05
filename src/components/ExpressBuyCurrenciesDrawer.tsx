import { Currency } from "../../peach-api/src/@types/global";
import { useOfferPreferences } from "../store/offerPreferenes";
import { CurrenciesDrawer } from "./CurrenciesDrawer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
export function ExpressBuyCurrenciesDrawer({ isOpen, onClose }: Props) {
  const selectedCurrencies = useOfferPreferences(
    (state) => state.expressBuyFilterByCurrencyList,
  );
  const setExpressBuyFilterByCurrencyList = useOfferPreferences(
    (state) => state.setExpressBuyFilterByCurrencyList,
  );

  const handleToggleCurrency = (currency: Currency) => {
    const isSelected = selectedCurrencies.includes(currency);
    if (isSelected) {
      setExpressBuyFilterByCurrencyList(
        selectedCurrencies.filter((c) => c !== currency),
      );
    } else {
      setExpressBuyFilterByCurrencyList([...selectedCurrencies, currency]);
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
