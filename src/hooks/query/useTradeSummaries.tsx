import { useCallback, useMemo } from "react";
import { sortSummariesByDate } from "../../utils/contract/sortSummariesByDate";
import { getPastOffers } from "../../views/yourTrades/utils/getPastOffers";
import { isOpenOffer } from "../../views/yourTrades/utils/isOpenOffer";
import { useContractSummaries } from "./useContractSummaries";
import { useOfferSummaries } from "./useOfferSummaries";

export const useTradeSummaries = (enabled = true) => {
  const {
    offers,
    isLoading: offersLoading,
    error: offersError,
    refetch: refetchOffers,
  } = useOfferSummaries(enabled);
  const {
    contracts,
    isLoading: contractsLoading,
    error: contractsError,
    refetch: refetchContracts,
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
    () => tradeSummaries.filter(({ tradeStatus }) => isOpenOffer(tradeStatus)),
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
    tradeSummaries,
    openBuyOffers: summaries["yourTrades.buy"],
    openSellOffers: summaries["yourTrades.sell"],
    pastOffers: summaries["yourTrades.history"],
    refetch,
  };
};
