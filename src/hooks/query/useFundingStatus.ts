import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { error } from "../../utils/log/error";
import { peachAPI } from "../../utils/peachAPI";
import { offerKeys } from "./offerKeys";

export const useFundingStatus = (id: string) => {
  const {
    data,
    isLoading,
    error: fundingStatusError,
    isPending,
  } = useQuery({
    queryKey: offerKeys.fundingStatus(id),
    queryFn: getFundingStatusQuery,
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * 1000,
  });

  return {
    fundingStatus: data?.fundingStatus,
    isLoading,
    isPending,
    error: fundingStatusError,
  };
};

async function getFundingStatusQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof offerKeys.fundingStatus>>) {
  const offerId = queryKey[2];

  const { result: fundingStatus, error: err } =
    await peachAPI.private.offer.getFundingStatus({ offerId });
  if (!fundingStatus || err) {
    error("Could not fetch funding status for offer", offerId, err?.error);
    throw new Error(err?.error);
  }
  return fundingStatus;
}
