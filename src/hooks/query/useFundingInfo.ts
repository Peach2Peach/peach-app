import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { MSINASECOND } from "../../constants";
import { error } from "../../utils/log/error";
import { peachAPI } from "../../utils/peachAPI";
import { offerKeys } from "./useOfferDetail";

const TWENTY = 20;
const TWENTYSECONDS = TWENTY * MSINASECOND;

export const useFundingInfo = (id: string, enabled = true) => {
  const {
    data,
    isLoading,
    error: fundingStatusError,
    isPending,
  } = useQuery({
    queryKey: offerKeys.fundingInfo(id),
    queryFn: getFundingInfoQuery,
    enabled,
    refetchInterval: TWENTYSECONDS,
  });

  return {
    fundingStatus: data?.funding,
    userConfirmationRequired: data?.userConfirmationRequired,
    isLoading,
    isPending,
    error: fundingStatusError,
  };
};

async function getFundingInfoQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof offerKeys.fundingInfo>>) {
  const offerId = queryKey[2];

  const { result: fundingStatus, error: err } =
    await peachAPI.private.offer.getFundingInfo({ offerId });
  if (!fundingStatus || err) {
    error("Could not fetch funding info for offer", offerId, err?.error);
    throw new Error(err?.error);
  }
  return fundingStatus;
}
