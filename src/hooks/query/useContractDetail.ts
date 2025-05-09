import { useIsFocused } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { peachAPI } from "../../utils/peachAPI";

export const contractKeys = {
  all: ["contracts"] as const,
  summaries: () => [...contractKeys.all, "summaries"] as const,
  summary: (id: string) => [...contractKeys.summaries(), id] as const,
  details: () => [...contractKeys.all, "details"] as const,
  detail: (id: string) => [...contractKeys.details(), id] as const,
  decryptedData: (id: string) =>
    [...contractKeys.detail(id), "decryptedData"] as const,
  chat: (id: string) => [...contractKeys.detail(id), "chat"] as const,
};

export const useContractDetail = (id: string) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: contractKeys.detail(id),
    queryFn: getContractDetail,
    enabled: isFocused,
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS,
  });

  return { contract: data, isLoading, isFetching, refetch, error };
};

async function getContractDetail({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof contractKeys.detail>>) {
  const contractId = queryKey[2];
  const { result: contract } = await peachAPI.private.contract.getContract({
    contractId,
  });

  if (!contract) {
    throw new Error("Contract not found");
  }

  return contract;
}
