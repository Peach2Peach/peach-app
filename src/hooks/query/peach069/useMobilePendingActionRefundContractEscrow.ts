import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const user69MobilePendingActionRefundContractEscrowKeys = {
  all: ["peach069MobilePendingActionRefundContractEscrow"] as const,
  details: (contractId: string) =>
    [...user69MobilePendingActionRefundContractEscrowKeys.all, "details", contractId] as const,
};

export const useMobilePendingActionRefundContractEscrow = (contractId: string) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69MobilePendingActionRefundContractEscrowKeys.details(contractId),
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
  const contractId = queryKey[2];

  const { result } =
    await peachAPI.private.peach069.getMobilePendingActionRefundContractEscrow({ contractId });

  return result;
}
