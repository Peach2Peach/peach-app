import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { MSINASECOND } from "../../constants";
import { pickFundingStatus } from "../../utils/offer/pickFundingStatus";
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
    refetch,
  } = useQuery({
    queryKey: offerKeys.fundingStatus(id),
    queryFn: getFundingStatusQuery,
    enabled,
    refetchInterval: TWENTYSECONDS,
  });

  return {
    fundingStatus: data?.funding,
    userConfirmationRequired: data?.userConfirmationRequired,
    escrow: data?.escrow,
    isLoading,
    isPending,
    error: fundingStatusError,
    refetch,
  };
};

async function getFundingStatusQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof offerKeys.fundingStatus>>) {
  const offerId = queryKey[2];

  const { result, error: _err } =
    await peachAPI.private.offer.getFundingStatus({ offerId });
  // if (!result || err) {
  //   error("Could not fetch funding status for offer", offerId, err?.error);
  //   throw new Error(err?.error);
  // }
  if (!result) return result;

  // the response carries bitcoin funding in `funding` and liquid funding in a
  // sibling `fundingLiquid`; collapse to the active one so `funding.status`,
  // `.amounts`, `.txIds` reads work regardless of chain
  return {
    ...result,
    funding: pickFundingStatus(result.funding, result.fundingLiquid),
  };
}
