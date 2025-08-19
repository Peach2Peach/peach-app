import { useQuery } from "@tanstack/react-query";
import { FIVE_SECONDS } from "../../constants";
import { peachAPI } from "../../utils/peachAPI";
import { contractKeys } from "./useContractDetail";

export const useContractSummaries = (enabled = true) => {
  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: contractKeys.summaries(),
    queryFn: getContractSummariesQuery,
    enabled,
    refetchInterval: FIVE_SECONDS,
    refetchOnWindowFocus: true,
  });

  return {
    contracts: data || [],
    isLoading,
    isRefetching,
    error,
    refetch,
  };
};

export async function getContractSummariesQuery() {
  const { result: contracts, error } =
    await peachAPI.private.contract.getContractSummaries();

  if (error?.error || !contracts)
    throw new Error(error?.error || "Error fetching contract summaries");

  return contracts.map((contract) => ({
    ...contract,
    creationDate: new Date(contract.creationDate),
    lastModified: new Date(contract.lastModified),
    paymentMade: contract.paymentMade
      ? new Date(contract.paymentMade)
      : undefined,
  }));
}
