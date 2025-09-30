import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const useChatMessagesOfTradeRequestReceivedToBuyOffer = ({
  buyOfferId,
  userId,
  isEnabled = true,
}: {
  buyOfferId: string;
  userId: string;
  isEnabled?: boolean;
}) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [
      "peach069ChatMessagesOfTradeRequestReceivedToBuyOffer",
      buyOfferId,
      userId,
    ],
    queryFn: getChatMessagesOfTradeRequestReceivedToBuyOffer,
    enabled: isEnabled,
    refetchInterval: FIVE_SECONDS,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, isFetching, refetch, error };
};

async function getChatMessagesOfTradeRequestReceivedToBuyOffer({
  queryKey,
}: QueryFunctionContext) {
  const buyOfferId = queryKey[1];
  const userId = queryKey[2];
  const { result: messages } =
    await peachAPI.private.peach069.getChatMessagesOfReceivedBuyOfferTradeRequest(
      {
        buyOfferId,
        userId,
      },
    );

  return messages;
}
