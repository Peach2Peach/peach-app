import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../../utils/peachAPI";

export const useSellOfferTradeRequestReceivedByIds = ({
  sellOfferId,
  userId,
  isEnabled = true,
}: {
  sellOfferId: string;
  userId: string;
  isEnabled?: boolean;
}) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [
      "peach069sellOfferTradeRequestReceivedByIds",
      sellOfferId,
      userId,
    ],
    queryFn: getSellOfferTradeRequest,
    enabled: isFocused && isEnabled,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, isFetching, refetch, error };
};

async function getSellOfferTradeRequest({ queryKey }: QueryFunctionContext) {
  const sellOfferId = queryKey[1];
  const userId = queryKey[2];
  const { result: offer } =
    await peachAPI.private.peach069.getSellOfferTradeRequestReceivedByIds({
      sellOfferId,
      userId,
    });

  return offer;
}
