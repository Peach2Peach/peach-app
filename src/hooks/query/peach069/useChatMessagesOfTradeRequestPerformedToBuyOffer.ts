import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const useChatMessagesOfTradeRequestPerformedToBuyOffer = ({
  buyOfferId,
  isEnabled = true,
}: {
  buyOfferId: string;
  isEnabled?: boolean;
}) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: [
      "peach069ChatMessagesOfTradeRequestPerformedToBuyOffer",
      buyOfferId,
    ],
    queryFn: getChatMessagesOfTradeRequestPerformedToBuyOffer,
    enabled: isEnabled,
    refetchInterval: FIVE_SECONDS,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return { data, isLoading, isFetching, refetch, error };
};

async function getChatMessagesOfTradeRequestPerformedToBuyOffer({
  queryKey,
}: QueryFunctionContext) {
  const buyOfferId = queryKey[1];
  const { result: messages } =
    await peachAPI.private.peach069.getChatMessagesOfPerformedBuyOfferTradeRequest(
      {
        buyOfferId,
      },
    );

  return messages;
}
