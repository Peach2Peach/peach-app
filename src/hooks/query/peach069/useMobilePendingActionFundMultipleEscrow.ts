import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const user69MobilePendingActionFundMultipleEscrowKeys = {
  all: ["peach069MobilePendingActionFundMultipleEscrow"] as const,
  details: (id: string) =>
    [
      ...user69MobilePendingActionFundMultipleEscrowKeys.all,
      "fundMultipleEscrow",
      id,
    ] as const,
};

export const useMobilePendingActionFundMultipleEscrow = (id: string) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69MobilePendingActionFundMultipleEscrowKeys.details(id),
    queryFn: getMobilePendingActionFundMultipleEscrow,
    refetchInterval: FIVE_SECONDS,
  });

  return { mobilePendingAction: data, isLoading, isFetching, refetch, error };
};

async function getMobilePendingActionFundMultipleEscrow({
  queryKey,
}: QueryFunctionContext<
  ReturnType<typeof user69MobilePendingActionFundMultipleEscrowKeys.details>
>) {
  const id = queryKey[2];

  const { result } =
    await peachAPI.private.peach069.getMobilePendingActionFundMultipleEscrow({
      id,
    });

  return result;
}
