import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../../utils/peachAPI";

export const useBuyOfferDetail = (id: string) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["peach069buyOffer", id],
    queryFn: getBuyOfferDetail,
    enabled: isFocused,
  });

  return { buyOffer: data, isLoading, isFetching, refetch, error };
};

async function getBuyOfferDetail({ queryKey }: QueryFunctionContext) {
  const buyOfferId = queryKey[1];
  const { result: contract } = await peachAPI.private.peach069.getBuyOfferById({
    buyOfferId,
  });

  if (!contract) {
    throw new Error("Contract not found");
  }

  return contract;
}
