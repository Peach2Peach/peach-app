import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useTradeSummaryStore } from "../../store/tradeSummaryStore";
import { peachAPI } from "../../utils/peachAPI";
import { contractKeys } from "./useContractDetail";

const getContractSummariesQuery = async () => {
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
};

export const useContractSummaries = (enabled = true) => {
  const [contracts, setContracts, lastModified] = useTradeSummaryStore(
    (state) => [state.contracts, state.setContracts, state.lastModified],
    shallow,
  );
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: contractKeys.summaries(),
    queryFn: getContractSummariesQuery,
    enabled,
    initialData: contracts.length ? contracts : undefined,
    initialDataUpdatedAt: lastModified.getTime?.(),
  });

  useEffect(() => {
    if (data) setContracts(data);
  }, [data, setContracts]);

  return { contracts: data || [], isLoading, error, refetch };
};
