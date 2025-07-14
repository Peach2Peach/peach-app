import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

const sellOfferDetailKeys = {
  all: ["peach069sellOffer"] as const,
  details: () => [...sellOfferDetailKeys.all, "details"] as const,
  detail: (id: string) => [...sellOfferDetailKeys.details(), id] as const,
};

export const useSellOfferDetail = (id: string) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: sellOfferDetailKeys.detail(id),
    queryFn: getSellOfferDetail,
    enabled: isFocused,
    refetchInterval: FIVE_SECONDS,
  });

  return { sellOffer: data, isLoading, isFetching, refetch, error };
};

async function getSellOfferDetail({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof sellOfferDetailKeys.detail>>) {
  const sellOfferId = queryKey[2];
  const { result } = await peachAPI.private.peach069.getSellOfferById({
    sellOfferId,
  });

  if (!result) {
    throw new Error("Sell Offer not found");
  }

  return result;
}
