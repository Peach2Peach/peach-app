import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../../utils/peachAPI";

export const useBuyOfferTradeRequestsReceived = (id: string) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["peach069buyOfferTradeRequestsReceived", id],
    queryFn: getBuyOfferTradeRequests,
    enabled: isFocused,
  });

  return { buyOfferTradeRequests: data, isLoading, isFetching, refetch, error };
};

async function getBuyOfferTradeRequests({ queryKey }: QueryFunctionContext) {
  const buyOfferId = queryKey[1];
  const { result: offer } =
    await peachAPI.private.peach069.getBuyOfferTradeRequestsReceivedById({
      buyOfferId,
    });

  return offer;
}
