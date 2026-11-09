import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const user69MobilePendingActionSubmitBuyOfferProofKeys = {
  all: ["peach069MobilePendingActionSubmitBuyOfferProof"] as const,
  details: (id: string) =>
    [
      ...user69MobilePendingActionSubmitBuyOfferProofKeys.all,
      "details",
      id,
    ] as const,
};

export const useMobilePendingActionSubmitBuyOfferProof = (id: string) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69MobilePendingActionSubmitBuyOfferProofKeys.details(id),
    queryFn: getMobilePendingActionSubmitBuyOfferProof,
    refetchInterval: FIVE_SECONDS,
  });

  return { mobilePendingAction: data, isLoading, isFetching, refetch, error };
};

async function getMobilePendingActionSubmitBuyOfferProof({
  queryKey,
}: QueryFunctionContext<
  ReturnType<typeof user69MobilePendingActionSubmitBuyOfferProofKeys.details>
>) {
  const id = queryKey[2];

  const { result } =
    await peachAPI.private.peach069.getMobilePendingActionSubmitBuyOfferProof({
      id,
    });

  return result;
}
