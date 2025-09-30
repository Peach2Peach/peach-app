import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { TEN_SECONDS } from "../../../constants";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import { peachAPI } from "../../../utils/peachAPI";

export const useExpressSellBuyOffers = () => {
  const [
    expressSellFilterByAmountRange,
    expressSellFilterByCurrencyList,
    expressSellFilterByPaymentMethodList,
    expressSellFilterMinPremium,
    expressSellOffersSorter,
  ] = useOfferPreferences(
    (state) => [
      state.expressSellFilterByAmountRange,
      state.expressSellFilterByCurrencyList,
      state.expressSellFilterByPaymentMethodList,
      state.expressSellFilterMinPremium,
      state.expressSellOffersSorter,
    ],
    shallow,
  );

  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [
      "peach069expressSellBuyOffers",
      expressSellFilterByAmountRange[0],
      expressSellFilterByAmountRange[1],
      expressSellFilterByCurrencyList,
      expressSellFilterByPaymentMethodList,
      expressSellFilterMinPremium,
      expressSellOffersSorter,
    ] as const,
    queryFn: async ({ queryKey }) => {
      const { result: buyOffers } =
        await peachAPI.private.peach069.getBuyOffers({
          minAmountSats: queryKey[1],
          maxAmountSats: queryKey[2],
          currencies: queryKey[3],
          paymentMethods: queryKey[4],
          minPremium: queryKey[5],
          offersSorter: queryKey[6],
        });
      return buyOffers;
    },
    enabled: isFocused,
    refetchInterval: TEN_SECONDS,
  });

  return {
    buyOffers: data?.offers,
    stats: data?.stats,
    isLoading,
    isFetching,
    refetch,
    error,
  };
};
