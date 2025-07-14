import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

const buyOfferDetailKeys = {
  all: ["peach069buyOffer"] as const,
  details: () => [...buyOfferDetailKeys.all, "details"] as const,
  detail: (id: string) => [...buyOfferDetailKeys.details(), id] as const,
};

export const useBuyOfferDetail = (id: string) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: buyOfferDetailKeys.detail(id),
    queryFn: getBuyOfferDetail,
    enabled: isFocused,
    refetchInterval: FIVE_SECONDS,
  });

  return { buyOffer: data, isLoading, isFetching, refetch, error };
};

async function getBuyOfferDetail({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof buyOfferDetailKeys.detail>>) {
  const buyOfferId = queryKey[2];
  const { result } = await peachAPI.private.peach069.getBuyOfferById({
    buyOfferId,
  });

  if (!result) {
    throw new Error("Buy Offer not found");
  }

  return result;
}
