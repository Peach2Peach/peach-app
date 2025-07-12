import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../../utils/peachAPI";

export const useBuyOfferTradeRequestReceivedByIds = ({
  buyOfferId,
  userId,
  isEnabled = true,
}: {
  buyOfferId: string;
  userId: string;
  isEnabled?: boolean;
}) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["peach069buyOfferTradeRequestReceivedByIds", buyOfferId, userId],
    queryFn: getBuyOfferTradeRequest,
    enabled: isFocused && isEnabled,
  });

  return { data, isLoading, isFetching, refetch, error };
};

async function getBuyOfferTradeRequest({ queryKey }: QueryFunctionContext) {
  const buyOfferId = queryKey[1];
  const userId = queryKey[2];
  const { result: offer } =
    await peachAPI.private.peach069.getBuyOfferTradeRequestReceivedByIds({
      buyOfferId,
      userId,
    });

  return offer;
}
