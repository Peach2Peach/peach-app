import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";
import { FIVE_SECONDS } from "../../../constants";
import { useOfferPreferences } from "../../../store/offerPreferenes/useOfferPreferences";
import { peachAPI } from "../../../utils/peachAPI";

export const useExpressBuySellOffers = () => {
  const [
    expressBuyFilterByAmountRange,
    expressBuyFilterByCurrencyList,
    expressBuyFilterByPaymentMethodList,
    expressBuyFilterMaxPremium,
    expressBuyOffersSorter,
  ] = useOfferPreferences(
    (state) => [
      state.expressBuyFilterByAmountRange,
      state.expressBuyFilterByCurrencyList,
      state.expressBuyFilterByPaymentMethodList,
      state.expressBuyFilterMaxPremium,
      state.expressBuyOffersSorter,
    ],
    shallow,
  );
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [
      "peach069expressBuySellOffers",
      expressBuyFilterByAmountRange[0],
      expressBuyFilterByAmountRange[1],
      expressBuyFilterByCurrencyList,
      expressBuyFilterByPaymentMethodList,
      expressBuyFilterMaxPremium,
      expressBuyOffersSorter,
    ] as const,
    queryFn: async ({ queryKey }) => {
      const { result: sellOffers } =
        await peachAPI.private.peach069.getSellOffers({
          minAmountSats: queryKey[1],
          maxAmountSats: queryKey[2],
          currencies: queryKey[3],
          paymentMethods: queryKey[4],
          maxPremium: queryKey[5],
          offersSorter: queryKey[6],
        });

      return sellOffers?.offers;
    },
    enabled: isFocused,
    refetchInterval: FIVE_SECONDS,
  });

  return { sellOffers: data, isLoading, isFetching, refetch, error };
};
