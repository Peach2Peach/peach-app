import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const user69MobilePendingActionPaymentMadeKeys = {
  all: ["peach069MobilePendingActionPaymentMade"] as const,
  details: (id: string) =>
    [...user69MobilePendingActionPaymentMadeKeys.all, "details", id] as const,
};

export const useMobilePendingActionPaymentMade = (id: string) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69MobilePendingActionPaymentMadeKeys.details(id),
    queryFn: getMobilePendingActionPaymentMade,
    refetchInterval: FIVE_SECONDS,
  });

  return { mobilePendingAction: data, isLoading, isFetching, refetch, error };
};

async function getMobilePendingActionPaymentMade({
  queryKey,
}: QueryFunctionContext<
  ReturnType<typeof user69MobilePendingActionPaymentMadeKeys.details>
>) {
  const id = queryKey[2];

  const { result } =
    await peachAPI.private.peach069.getMobilePendingActionPaymentMade({
      id,
    });

  return result;
}
