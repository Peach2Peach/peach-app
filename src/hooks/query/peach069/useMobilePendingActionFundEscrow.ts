import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const user69MobilePendingActionFundEscrowKeys = {
  all: ["peach069MobilePendingActionFundEscrow"] as const,
  details: (id: string) =>
    [...user69MobilePendingActionFundEscrowKeys.all, "details", id] as const,
};

export const useMobilePendingActionFundEscrow = (id: string) => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69MobilePendingActionFundEscrowKeys.details(id),
    queryFn: getMobilePendingActionFundEscrow,
    refetchInterval: FIVE_SECONDS,
  });

  return { mobilePendingAction: data, isLoading, isFetching, refetch, error };
};

async function getMobilePendingActionFundEscrow({
  queryKey,
}: QueryFunctionContext<
  ReturnType<typeof user69MobilePendingActionFundEscrowKeys.details>
>) {
  const id = queryKey[2];

  const { result } =
    await peachAPI.private.peach069.getMobilePendingActionFundEscrow({ id });

  return result;
}
