import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { MSINASECOND } from "../../constants";
import { peachAPI } from "../../utils/peachAPI";
import { offerKeys } from "./useOfferDetail";

const TWENTY = 20;
const TWENTYSECONDS = TWENTY * MSINASECOND;

export const useFundingStatus = (id: string, enabled = true) => {
  const {
    data,
    isLoading,
    error: fundingStatusError,
    isPending,
  } = useQuery({
    queryKey: offerKeys.fundingStatus(id),
    queryFn: getFundingStatusQuery,
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

async function getFundingStatusQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof offerKeys.fundingStatus>>) {
  const offerId = queryKey[2];

  const { result: fundingStatus, error: _err } =
    await peachAPI.private.offer.getFundingStatus({ offerId });
  // if (!fundingStatus || err) {
  //   error("Could not fetch funding status for offer", offerId, err?.error);
  //   throw new Error(err?.error);
  // }
  return fundingStatus;
}
