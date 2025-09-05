import { Currency } from "../../peach-api/src/@types/global";
import { useOfferPreferences } from "../store/offerPreferenes";
import { CurrenciesDrawer } from "./CurrenciesDrawer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: Partial<Record<Currency, number>>;
}

export function ExpressSellCurrenciesDrawer({ stats, isOpen, onClose }: Props) {
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
  // const { data: buyOfferCurrencies } = useQuery({
  //   queryKey: ["peach069expressBuyOffers"],
  //   queryFn: async () => {
  //     const { result } = await peachAPI.private.peach069.getBuyOffers({});
  //     return result?.stats.currencies;
  //   },
  //   refetchInterval: MSINASECOND * 5,
  // });

  return (
    <CurrenciesDrawer
      isOpen={isOpen}
      onClose={onClose}
      selectedCurrencies={selectedCurrencies}
      onToggleCurrency={handleToggleCurrency}
      currencyOfferAmounts={stats}
    />
  );
}
