import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";

const getContractQuery = async ({
  queryKey,
}: {
  queryKey: [string, string];
}) => {
  const [, contractId] = queryKey;
  const { result: contract } = await peachAPI.private.contract.getContract({
    contractId,
  });

  if (!contract) {
    throw new Error("Contract not found");
  }

  return contract;
};

export const useContractDetails = (id: string, refetchInterval?: number) => {
  const isFocused = useIsFocused();
  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ["contract", id],
    queryFn: getContractQuery,
    refetchInterval,
    enabled: isFocused,
  });

  return { contract: data, isLoading, isFetching, refetch, error };
};