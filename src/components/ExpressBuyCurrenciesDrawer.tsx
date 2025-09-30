import { useQuery } from "@tanstack/react-query";
import { Currency } from "../../peach-api/src/@types/global";
import { useOfferPreferences } from "../store/offerPreferenes";
import { peachAPI } from "../utils/peachAPI";
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

  const onReset = () => setExpressBuyFilterByCurrencyList([]);

  const { data: sellOfferCurrencies } = useQuery({
    queryKey: ["peach069expressBuySellOffers", "stats", "currencies"],
    queryFn: async () => {
      const { result } = await peachAPI.private.peach069.getSellOffers({});
      return result?.stats.currencies;
    },
  });

  return (
    <CurrenciesDrawer
      isOpen={isOpen}
      onClose={onClose}
      selectedCurrencies={selectedCurrencies}
      onToggleCurrency={handleToggleCurrency}
      currencyOfferAmounts={sellOfferCurrencies}
      onReset={onReset}
    />
  );
}
