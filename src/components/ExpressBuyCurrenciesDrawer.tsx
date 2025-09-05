import { Currency } from "../../peach-api/src/@types/global";
import { useOfferPreferences } from "../store/offerPreferenes";
import { CurrenciesDrawer } from "./CurrenciesDrawer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stats: Partial<Record<Currency, number>>;
}
export function ExpressBuyCurrenciesDrawer({ isOpen, onClose, stats }: Props) {
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
  // const { data: sellOfferCurrencies } = useQuery({
  //   queryKey: ["peach069expressBuySellOffers"],
  //   queryFn: async () => {
  //     const { result } = await peachAPI.private.peach069.getSellOffers({});
  //     return result?.stats.currencies;
  //   },
  //   refetchInterval: MSINASECOND,
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
