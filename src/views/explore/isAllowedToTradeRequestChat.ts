import { useQuery } from "@tanstack/react-query";
import { MSINASECOND, TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { tradeRequestKeys } from "../../hooks/query/tradeRequestKeys";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { peachAPI } from "../../utils/peachAPI";

export function useIsAllowedToTradeRequestChat(offerId: string) {
  const { user } = useSelfUser();
  return useQuery({
    queryKey: tradeRequestKeys.isAllowedToChat(offerId, user?.id || ""),
    queryFn: async () => {
      if (!user?.id) throw new Error("User not found");
      const { result, error } =
        await peachAPI.private.offer.isAllowedToTradeRequestChat({
          offerId,
          requestingUserId: user.id,
        });

      if (error) throw new Error(error.error);

      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * MSINASECOND,
    enabled: !!user?.id,
  });
}
