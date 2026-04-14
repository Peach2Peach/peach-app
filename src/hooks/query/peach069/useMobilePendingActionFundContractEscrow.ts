import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const user69MobilePendingActionFundContractEscrowKeys = {
  all: ["peach069MobilePendingActionFundContractEscrow"] as const,
  details: (contractId: string) =>
    [...user69MobilePendingActionFundContractEscrowKeys.all, "details", contractId] as const,
};

export const useMobilePendingActionFundContractEscrow = (contractId: string) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69MobilePendingActionFundContractEscrowKeys.details(contractId),
    queryFn: getMobilePendingActionFundContractEscrow,
    refetchInterval: FIVE_SECONDS,
  });

  return { mobilePendingAction: data, isLoading, isFetching, refetch, error };
};

async function getMobilePendingActionFundContractEscrow({
  queryKey,
}: QueryFunctionContext<
  ReturnType<typeof user69MobilePendingActionFundContractEscrowKeys.details>
>) {
  const contractId = queryKey[2];

  const { result } =
    await peachAPI.private.peach069.getMobilePendingActionFundContractEscrow({ contractId });

  return result;
}
