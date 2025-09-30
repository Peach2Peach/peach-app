import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../../utils/peachAPI";

const canInstantTradeWithBuyOfferKeys = {
  all: ["peach069buyOfferCanInstantTrade"] as const,
  details: () => [...canInstantTradeWithBuyOfferKeys.all, "details"] as const,
  detail: (id: string) =>
    [...canInstantTradeWithBuyOfferKeys.details(), id] as const,
};

export const useCanInstantTradeWithBuyOffer = (id: string) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: canInstantTradeWithBuyOfferKeys.detail(id),
    queryFn: canInstantTradeWithBuyOffer,
    enabled: isFocused,
    // refetchInterval: FIFTEEN_SECONDS,
  });

  return { data, isLoading, isFetching, refetch, error };
};

async function canInstantTradeWithBuyOffer({
  queryKey,
}: QueryFunctionContext<
  ReturnType<typeof canInstantTradeWithBuyOfferKeys.detail>
>) {
  const buyOfferId = queryKey[2];
  const { result } =
    await peachAPI.private.peach069.canPerformInstantTradeWithBuyOfferById({
      buyOfferId,
    });

  if (!result) {
    throw new Error("Buy Offer not found");
  }

  return result.result;
}
