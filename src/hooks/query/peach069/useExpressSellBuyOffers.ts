import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const useExpressSellBuyOffers = (
  minAmountSats: number,
  maxAmountSats: number,
  currencies: Currency[],
  paymentMethodIds: string[],
  minPremium: number,
  expressSellOffersSorter: ExpressSellOfferSorter,
) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [
      "peach069expressSellBuyOffers",
      minAmountSats,
      maxAmountSats,
      currencies,
      paymentMethodIds,
      minPremium,
      expressSellOffersSorter,
    ],
    queryFn: getExpressSellBuyOffers,
    enabled: isFocused,
    refetchInterval: FIVE_SECONDS,
  });

  return { buyOffers: data, isLoading, isFetching, refetch, error };
};

async function getExpressSellBuyOffers({ queryKey }: QueryFunctionContext) {
  const { result: buyOffers } = await peachAPI.private.peach069.getBuyOffers({
    minAmountSats: queryKey[1] as number,
    maxAmountSats: queryKey[2] as number,
    currencies: queryKey[3] as string[],
    paymentMethods: queryKey[4] as string[],
    minPremium: queryKey[5] as number,
    ownOffers: false,
    offersSorter: queryKey[6] as ExpressSellOfferSorter,
  });

  return buyOffers;
}
