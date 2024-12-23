import { useCallback, useMemo } from "react";
import { sortSummariesByDate } from "../../utils/contract/sortSummariesByDate";
import { getPastOffers } from "../../views/yourTrades/utils/getPastOffers";
import { isPastOffer } from "../../views/yourTrades/utils/isPastOffer";
import { useContractSummaries } from "./useContractSummaries";
import { useOfferSummaries } from "./useOfferSummaries";

export const useTradeSummaries = (enabled = true) => {
  const {
    offers,
    isLoading: offersLoading,
    error: offersError,
    refetch: refetchOffers,
    isRefetching: isRefetchingOffers,
  } = useOfferSummaries(enabled);
  const {
    contracts,
    isLoading: contractsLoading,
    error: contractsError,
    refetch: refetchContracts,
    isRefetching: isRefetchingContracts,
  } = useContractSummaries(enabled);

  const refetch = useCallback(() => {
    refetchOffers();
    refetchContracts();
  }, [refetchContracts, refetchOffers]);

  const filteredOffers = useMemo(
    () => offers.filter(({ contractId }) => !contractId),
    [offers],
  );
  const tradeSummaries = useMemo(
    () => [...filteredOffers, ...contracts].sort(sortSummariesByDate).reverse(),
    [contracts, filteredOffers],
  );

  const allOpenOffers = useMemo(
    () => tradeSummaries.filter(({ tradeStatus }) => !isPastOffer(tradeStatus)),
    [tradeSummaries],
  );
  const summaries = useMemo(
    () => ({
      "yourTrades.buy": allOpenOffers.filter(({ type }) => type === "bid"),
      "yourTrades.sell": allOpenOffers.filter(({ type }) => type === "ask"),
      "yourTrades.history": getPastOffers(tradeSummaries),
    }),
    [allOpenOffers, tradeSummaries],
  );

  return {
    isLoading: offersLoading || contractsLoading,
    error: offersError || contractsError,
    isRefetching: isRefetchingOffers || isRefetchingContracts,
    summaries,
    refetch,
  };
};
