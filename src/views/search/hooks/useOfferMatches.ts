import { useIsFocused } from "@react-navigation/native";
import {
  InfiniteData,
  QueryFunctionContext,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";
import {
  GetMatchesErrorResponseBody,
  GetMatchesResponseBody,
} from "../../../../peach-api/src/@types/api/offerAPI";
import { tradeRequestKeys } from "../../../hooks/query/offerKeys";
import { useOfferDetail } from "../../../hooks/query/useOfferDetail";
import { queryClient } from "../../../queryClient";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import {
  BuySorter,
  SellSorter,
} from "../../../store/offerPreferenes/useOfferPreferences";
import { info } from "../../../utils/log/info";
import { isBuyOffer } from "../../../utils/offer/isBuyOffer";
import { peachAPI } from "../../../utils/peachAPI";

export const PAGESIZE = 10;
export const matchesKeys = {
  matches: ["matches"] as const,
  matchesForOffer: (offerId: string) =>
    [...matchesKeys.matches, offerId] as const,
  matchDetail: (offerId: string, matchId: string) =>
    [...matchesKeys.matchesForOffer(offerId), matchId] as const,
  sortedMatchesForOffer: (
    offerId: string,
    sortBy: (BuySorter | SellSorter)[],
  ) => [...matchesKeys.matchesForOffer(offerId), sortBy] as const,
};

export const useOfferMatches = (
  offerId: string,
  refetchInterval?: number,
  enabled = true,
) => {
  const { offer } = useOfferDetail(offerId);
  const isFocused = useIsFocused();
  const sortBy = useOfferPreferences((state) =>
    !offer
      ? ["bestReputation" as const]
      : isBuyOffer(offer)
        ? state.sortBy.buyOffer
        : state.sortBy.sellOffer,
  );

  const queryData = useInfiniteQuery<
    GetMatchesResponseBody,
    GetMatchesErrorResponseBody,
    InfiniteData<GetMatchesResponseBody, unknown>,
    ReturnType<typeof matchesKeys.sortedMatchesForOffer>,
    number
  >({
    queryKey: matchesKeys.sortedMatchesForOffer(offerId, sortBy),
    queryFn: getMatchesQuery,
    refetchInterval,
    enabled: enabled && isFocused && !!offer?.id && !offer.doubleMatched,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    placeholderData: keepPreviousData,
  });
  const allMatches = useMemo(
    () => (queryData.data?.pages || []).flatMap((page) => page.matches),
    [queryData.data?.pages],
  );

  // saving this for the TradeRequest Chat
  allMatches.map((value) => {
    queryClient.setQueryData(
      tradeRequestKeys.detail(offerId, value.user.id),
      value,
    );
    return null;
  });

  return { ...queryData, allMatches };
};

async function getMatchesQuery({
  queryKey,
  pageParam,
}: QueryFunctionContext<
  ReturnType<typeof matchesKeys.sortedMatchesForOffer>,
  number
>) {
  info("Checking matches for", queryKey[1]);

  const offerId = queryKey[1];

  const { result, error: err } = await peachAPI.private.offer.getMatches({
    offerId,
    page: pageParam,
    size: PAGESIZE,
    sortBy: queryKey[2],
  });

  if (err || !result) throw new Error(err?.error || "Unknown error");

  return result;
}
