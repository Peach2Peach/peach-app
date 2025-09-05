import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIFTEEN_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

const canInstantTradeWithSellOfferKeys = {
  all: ["peach069sellOfferCanInstantTrade"] as const,
  details: () => [...canInstantTradeWithSellOfferKeys.all, "details"] as const,
  detail: (id: string) =>
    [...canInstantTradeWithSellOfferKeys.details(), id] as const,
};

export const useCanInstantTradeWithSellOffer = (id: string) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: canInstantTradeWithSellOfferKeys.detail(id),
    queryFn: canInstantTradeWithSellOffer,
    enabled: isFocused,
    refetchInterval: FIFTEEN_SECONDS,
  });

  return { data, isLoading, isFetching, refetch, error };
};

async function canInstantTradeWithSellOffer({
  queryKey,
}: QueryFunctionContext<
  ReturnType<typeof canInstantTradeWithSellOfferKeys.detail>
>) {
  const sellOfferId = queryKey[2];
  const { result } =
    await peachAPI.private.peach069.canPerformInstantTradeWithSellOfferById({
      sellOfferId,
    });

  if (!result) {
    throw new Error("Sell Offer not found");
  }

  return result.result;
}
