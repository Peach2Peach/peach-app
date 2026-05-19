import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const user69MobilePendingActionFundContractEscrowKeys = {
  all: ["peach069MobilePendingActionFundContractEscrow"] as const,
  details: (id: string) =>
    [...user69MobilePendingActionFundContractEscrowKeys.all, "details", id] as const,
};

export const useMobilePendingActionFundContractEscrow = (id: string) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69MobilePendingActionFundContractEscrowKeys.details(id),
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
  const id = queryKey[2];

  const { result } =
    await peachAPI.private.peach069.getMobilePendingActionFundContractEscrow({ id });

  return result;
}
