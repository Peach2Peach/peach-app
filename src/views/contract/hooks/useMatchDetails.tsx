import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../../utils/peachAPI";
import { matchesKeys } from "../../search/hooks/useOfferMatches";

export const useMatchDetails = ({
  offerId,
  matchId,
}: {
  offerId: string;
  matchId: string;
}) =>
  useQuery({
    queryKey: matchesKeys.matchDetail(offerId, matchId),
    queryFn: getMatchDetails,
    refetchInterval: 10000,
  });

async function getMatchDetails({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof matchesKeys.matchDetail>>) {
  const [, offerId, matchId] = queryKey;
  const { result, error } = await peachAPI.private.offer.getMatch({
    offerId,
    matchId,
  });
  if (error || !result) throw new Error(error?.error || "Match not found");
  return result;
}
