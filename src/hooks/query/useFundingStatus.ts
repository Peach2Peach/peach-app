import { useQuery } from "@tanstack/react-query";
import { MSINASECOND } from "../../constants";
import { error } from "../../utils/log/error";
import { getDefaultFundingStatus } from "../../utils/offer/constants";
import { peachAPI } from "../../utils/peachAPI";

const TWENTY = 20;
const TWENTYSECONDS = TWENTY * MSINASECOND;

const getFundingStatusQuery = async ({
  queryKey,
}: {
  queryKey: [string, string];
}) => {
  const [, offerId] = queryKey;

  const { result: fundingStatus, error: err } =
    await peachAPI.private.offer.getFundingStatus({ offerId });
  if (!fundingStatus || err) {
    error("Could not fetch funding status for offer", offerId, err?.error);
    throw new Error(err?.error);
  }
  return fundingStatus;
};

export const useFundingStatus = (id: string, enabled = true) => {
  const {
    data,
    isLoading,
    error: fundingStatusError,
  } = useQuery({
    queryKey: ["fundingStatus", id],
    queryFn: getFundingStatusQuery,
    enabled,
    refetchInterval: TWENTYSECONDS,
  });

  const fundingStatus = data?.funding || getDefaultFundingStatus(id);
  const fundingStatusLiquid =
    data?.fundingLiquid || getDefaultFundingStatus(id);
  const userConfirmationRequired = data?.userConfirmationRequired || false;

  return {
    fundingStatus,
    fundingStatusLiquid,
    userConfirmationRequired,
    isLoading,
    error: fundingStatusError,
  };
};
