import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const user69MobilePendingActionRefundKeys = {
  all: ["peach069MobilePendingActionRefund"] as const,
  details: (id: string) =>
    [...user69MobilePendingActionRefundKeys.all, "details", id] as const,
};

export const useMobilePendingActionRefund = (id: string) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69MobilePendingActionRefundKeys.details(id),
    queryFn: getMobilePendingActionRefund,
    refetchInterval: FIVE_SECONDS,
  });

  return { mobilePendingAction: data, isLoading, isFetching, refetch, error };
};

async function getMobilePendingActionRefund({
  queryKey,
}: QueryFunctionContext<
  ReturnType<typeof user69MobilePendingActionRefundKeys.details>
>) {
  const id = queryKey[2];

  const { result } =
    await peachAPI.private.peach069.getMobilePendingActionRefund({
      id,
    });

  return result;
}
