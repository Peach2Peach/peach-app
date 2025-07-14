import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const useExpressBuySellOffers = () => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["peach069expressBuySellOffers"],
    queryFn: getExpressBuySellOffers,
    enabled: isFocused,
    refetchInterval: FIVE_SECONDS,
  });

  return { sellOffers: data, isLoading, isFetching, refetch, error };
};

async function getExpressBuySellOffers({ queryKey }: QueryFunctionContext) {
  const { result: sellOffers } = await peachAPI.private.peach069.getSellOffers(
    {},
  );

  return sellOffers;
}
