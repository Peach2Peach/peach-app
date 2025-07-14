import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const useChatMessagesOfTradeRequestReceivedToSellOffer = ({
  sellOfferId,
  userId,
  isEnabled = true,
}: {
  sellOfferId: string;
  userId: string;
  isEnabled?: boolean;
}) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [
      "peach069ChatMessagesOfTradeRequestReceivedToSellOffer",
      sellOfferId,
      userId,
    ],
    queryFn: getChatMessagesOfTradeRequestReceivedToSellOffer,
    enabled: isEnabled,
    refetchInterval: FIVE_SECONDS,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, isFetching, refetch, error };
};

async function getChatMessagesOfTradeRequestReceivedToSellOffer({
  queryKey,
}: QueryFunctionContext) {
  const sellOfferId = queryKey[1];
  const userId = queryKey[2];
  const { result: messages } =
    await peachAPI.private.peach069.getChatMessagesOfReceivedSellOfferTradeRequest(
      {
        sellOfferId,
        userId,
      },
    );

  return messages;
}
