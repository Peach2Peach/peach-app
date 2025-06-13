import { useQuery } from "@tanstack/react-query";
import { MSINASECOND, TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { matchChatKeys } from "../../hooks/query/offerKeys";
import { peachAPI } from "../../utils/peachAPI";

export function useIsAllowedToMatchChat(
  offerId: string,
  matchingOfferId: string,
) {
  return useQuery({
    queryKey: matchChatKeys.isAllowedToChat(offerId, matchingOfferId),
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.isAllowedToMatchChat({
          offerId,
          matchingOfferId,
        });

      if (error) throw new Error(error.error);

      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * MSINASECOND,
  });
}
