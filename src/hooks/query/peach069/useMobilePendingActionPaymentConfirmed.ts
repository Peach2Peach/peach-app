import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const user69MobilePendingActionPaymentConfirmedKeys = {
  all: ["peach069MobilePendingActionPaymentConfirmed"] as const,
  details: (id: string) =>
    [
      ...user69MobilePendingActionPaymentConfirmedKeys.all,
      "details",
      id,
    ] as const,
};

export const useMobilePendingActionPaymentConfirmed = (id: string) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69MobilePendingActionPaymentConfirmedKeys.details(id),
    queryFn: getMobilePendingActionPaymentConfirmed,
    refetchInterval: FIVE_SECONDS,
  });

  return { mobilePendingAction: data, isLoading, isFetching, refetch, error };
};

async function getMobilePendingActionPaymentConfirmed({
  queryKey,
}: QueryFunctionContext<
  ReturnType<typeof user69MobilePendingActionPaymentConfirmedKeys.details>
>) {
  const id = queryKey[2];

  const { result } =
    await peachAPI.private.peach069.getMobilePendingActionPaymentConfirmed({
      id,
    });

  return result;
}
