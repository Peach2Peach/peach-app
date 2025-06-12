import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { MSINASECOND, TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { peachAPI } from "../../utils/peachAPI";
import { offerKeys } from "./offerKeys";

export const useFundingStatus = (id: string) =>
  useQuery({
    queryKey: offerKeys.fundingStatus(id),
    queryFn: getFundingStatusQuery,
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * MSINASECOND,
  });

async function getFundingStatusQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof offerKeys.fundingStatus>>) {
  const offerId = queryKey[2];

  const { result: fundingStatus, error: err } =
    await peachAPI.private.offer.getFundingStatus({ offerId });
  if (!fundingStatus || err) {
    throw new Error(err?.error);
  }
  return fundingStatus;
}
