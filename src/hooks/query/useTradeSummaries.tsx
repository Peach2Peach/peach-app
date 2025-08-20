import { useCallback, useMemo } from "react";
import { sortSummariesByDate } from "../../utils/contract/sortSummariesByDate";
import { getPastOffers } from "../../views/yourTrades/utils/getPastOffers";
import { isPastOffer } from "../../views/yourTrades/utils/isPastOffer";
import { useContractSummaries } from "./useContractSummaries";
import { useOfferSummaries } from "./useOfferSummaries";
import { useOwnPeach069BuyOffers } from "./usePeach069BuyOffers";

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

  const {
    buyOffers,
    isLoading: buyOffers69Loading,
    error: buyOffers69Error,
    refetch: refetchBuyOffers69,
    isRefetching: isRefetchingBuyOffers69,
  } = useOwnPeach069BuyOffers(enabled);

  const refetch = useCallback(() => {
    refetchOffers();
    refetchContracts();
    refetchBuyOffers69();
  }, [refetchContracts, refetchOffers, refetchBuyOffers69]);

  const tradeSummaries = useMemo(
    () => [...offers, ...contracts].sort(sortSummariesByDate).reverse(),
    [contracts, offers],
  );

  const buy69 = useMemo(
    () =>
      [
        ...contracts.filter(
          ({ type, tradeStatus }) =>
            type === "bid" && !isPastOffer(tradeStatus),
        ),
        ...buyOffers,
      ]
        .sort(sortSummariesByDate)
        .reverse(),
    [buyOffers, contracts],
  );

  const allOpenOffers = useMemo(
    () => tradeSummaries.filter(({ tradeStatus }) => !isPastOffer(tradeStatus)),
    [tradeSummaries],
  );
  const summaries = useMemo(
    () => ({
      // "yourTrades.buy": allOpenOffers.filter(({ type }) => type === "bid"),
      "yourTrades.sell": allOpenOffers.filter(({ type }) => type === "ask"),
      "yourTrades.history": getPastOffers(tradeSummaries),
      "yourTrades.69BuyOffer": buy69,
    }),
    [allOpenOffers, tradeSummaries, buy69],
  );

  return {
    isLoading: offersLoading || contractsLoading || buyOffers69Loading,
    error: offersError || contractsError || buyOffers69Error,
    isRefetching:
      isRefetchingOffers || isRefetchingContracts || isRefetchingBuyOffers69,
    summaries,
    refetch,
  };
};
