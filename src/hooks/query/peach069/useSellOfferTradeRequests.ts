import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../../utils/peachAPI";

export const useSellOfferTradeRequestsReceived = (id: string) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["peach069sellOfferTradeRequestsReceived", id],
    queryFn: getSellOfferTradeRequests,
    enabled: isFocused,
  });

  return {
    sellOfferTradeRequests: data,
    isLoading,
    isFetching,
    refetch,
    error,
  };
};

async function getSellOfferTradeRequests({ queryKey }: QueryFunctionContext) {
  const sellOfferId = queryKey[1];
  const { result: offer } =
    await peachAPI.private.peach069.getSellOfferTradeRequestsReceivedById({
      sellOfferId,
    });

  return offer;
}
