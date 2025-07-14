import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const useExpressSellBuyOffers = () => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["peach069expressSellBuyOffers"],
    queryFn: getExpressSellBuyOffers,
    enabled: isFocused,
    refetchInterval: FIVE_SECONDS,
  });

  return { buyOffers: data, isLoading, isFetching, refetch, error };
};

async function getExpressSellBuyOffers({ queryKey }: QueryFunctionContext) {
  const { result: buyOffers } = await peachAPI.private.peach069.getBuyOffers({
    ownOffers: false,
  });

  return buyOffers;
}
