import { useIsFocused } from "@react-navigation/native";
import {
  InfiniteData,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";
import {
  GetMatchesErrorResponseBody,
  GetMatchesResponseBody,
} from "../../../../peach-api/src/@types/api/offerAPI";
import { MSINASECOND } from "../../../constants";
import { useOfferDetails } from "../../../hooks/query/useOfferDetails";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import { getAbortWithTimeout } from "../../../utils/getAbortWithTimeout";
import { info } from "../../../utils/log/info";
import { isBuyOffer } from "../../../utils/offer/isBuyOffer";
import { peachAPI } from "../../../utils/peachAPI";

export const PAGESIZE = 10;
export const matchesKeys = {
  matches: ["matches"] as const,
  matchesByOfferId: (offerId: string) =>
    [...matchesKeys.matches, offerId] as const,
  sortedMatchesByOfferId: (offerId: string, sortBy: Sorter[]) =>
    [...matchesKeys.matchesByOfferId(offerId), sortBy] as const,
};
const NUMBER_OF_SECONDS = 30;
export const useOfferMatches = (
  offerId: string,
  refetchInterval?: number,
  enabled = true,
) => {
  const { offer } = useOfferDetails(offerId);
  const isFocused = useIsFocused();
  const sortBy: Sorter[] = useOfferPreferences((state) =>
    !offer
      ? ["bestReputation"]
      : isBuyOffer(offer)
        ? state.sortBy.buyOffer
        : state.sortBy.sellOffer,
  );

  const queryData = useInfiniteQuery<
    GetMatchesResponseBody,
    GetMatchesErrorResponseBody,
    InfiniteData<GetMatchesResponseBody, unknown>,
    ReturnType<typeof matchesKeys.sortedMatchesByOfferId>,
    number
  >({
    queryKey: matchesKeys.sortedMatchesByOfferId(offerId, sortBy),
    queryFn: async ({ queryKey, pageParam }) => {
      info("Checking matches for", queryKey[1]);
      const { result, error: err } = await peachAPI.private.offer.getMatches({
        offerId: queryKey[1],
        page: pageParam,
        size: PAGESIZE,
        signal: getAbortWithTimeout(NUMBER_OF_SECONDS * MSINASECOND).signal,
        sortBy: queryKey[2],
      });

      if (result) {
        info("matches: ", result.matches.length);
        return result;
      }
      throw err || new Error("Unknown error");
    },
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

  return { ...queryData, allMatches };
};
