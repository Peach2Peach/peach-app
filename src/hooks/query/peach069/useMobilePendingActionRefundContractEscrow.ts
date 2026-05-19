import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const user69MobilePendingActionRefundContractEscrowKeys = {
  all: ["peach069MobilePendingActionRefundContractEscrow"] as const,
  details: (id: string) =>
    [...user69MobilePendingActionRefundContractEscrowKeys.all, "details", id] as const,
};

export const useMobilePendingActionRefundContractEscrow = (id: string) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69MobilePendingActionRefundContractEscrowKeys.details(id),
    queryFn: getMobilePendingActionRefundContractEscrow,
    refetchInterval: FIVE_SECONDS,
  });

  return { mobilePendingAction: data, isLoading, isFetching, refetch, error };
};

async function getMobilePendingActionRefundContractEscrow({
  queryKey,
}: QueryFunctionContext<
  ReturnType<typeof user69MobilePendingActionRefundContractEscrowKeys.details>
>) {
  const id = queryKey[2];

  const { result } =
    await peachAPI.private.peach069.getMobilePendingActionRefundContractEscrow({ id });

  return result;
}
