import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export const user69MobilePendingActionsKeys = {
  all: ["peach069MobilePendingActions"] as const,
  details: () => [...user69MobilePendingActionsKeys.all, "details"] as const,
};

export const useMobilePendingActions = () => {
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: user69MobilePendingActionsKeys.details(),
    queryFn: getMobilePendingActions,
    refetchInterval: FIVE_SECONDS,
  });

  return { mobilePendingActions: data, isLoading, isFetching, refetch, error };
};

async function getMobilePendingActions({}: QueryFunctionContext<
  ReturnType<typeof user69MobilePendingActionsKeys.details>
>) {
  const { result } = await peachAPI.private.peach069.getMobilePendingActions(
    {},
  );

  return result;
}
