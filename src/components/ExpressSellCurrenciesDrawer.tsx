import { useQuery } from "@tanstack/react-query";
import { Currency } from "../../peach-api/src/@types/global";
import { useOfferPreferences } from "../store/offerPreferenes";
import { peachAPI } from "../utils/peachAPI";
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

  const onReset = () => setExpressSellFilterByCurrencyList([]);

  const { data: buyOfferCurrencies } = useQuery({
    queryKey: ["peach069expressBuyOffers", "stats", "currencies"],
    queryFn: async () => {
      const { result } = await peachAPI.private.peach069.getBuyOffers({});
      return result?.stats.currencies;
    },
  });

  return (
    <CurrenciesDrawer
      isOpen={isOpen}
      onClose={onClose}
      selectedCurrencies={selectedCurrencies}
      onToggleCurrency={handleToggleCurrency}
      currencyOfferAmounts={buyOfferCurrencies}
      onReset={onReset}
    />
  );
}
