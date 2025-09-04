import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const useExpressBuySellOffers = (
  minAmountSats: number,
  maxAmountSats: number,
  currencies: Currency[],
  paymentMethodIds: string[],
  maxPremium: number,
  expressBuyOffersSorter: ExpressBuyOfferSorter,
) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [
      "peach069expressBuySellOffers",
      minAmountSats,
      maxAmountSats,
      currencies,
      paymentMethodIds,
      maxPremium,
      expressBuyOffersSorter,
    ],
    queryFn: getExpressBuySellOffers,
    enabled: isFocused,
    refetchInterval: FIVE_SECONDS,
  });

  return { sellOffers: data, isLoading, isFetching, refetch, error };
};

async function getExpressBuySellOffers({ queryKey }: QueryFunctionContext) {
  const { result: sellOffers } = await peachAPI.private.peach069.getSellOffers({
    minAmountSats: queryKey[1] as number,
    maxAmountSats: queryKey[2] as number,
    currencies: queryKey[3] as string[],
    paymentMethods: queryKey[4] as string[],
    maxPremium: queryKey[5] as number,
    offersSorter: queryKey[6] as ExpressBuyOfferSorter,
  });

  return sellOffers?.offers;
}
