import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { MSINASECOND } from "../../constants";
import { queryClient } from "../../queryClient";
import { error } from "../../utils/log/error";
import { peachAPI } from "../../utils/peachAPI";
import { offerKeys } from "./offerKeys";

const TWENTY = 20;
const TWENTYSECONDS = TWENTY * MSINASECOND;

export const useEscrowInfo = (id: string, enabled = true) => {
  const {
    data,
    isLoading,
    error: fundingStatusError,
    isPending,
  } = useQuery({
    queryKey: offerKeys.escrowInfo(id),
    queryFn: getEscrowInfoQuery,
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

async function getEscrowInfoQuery({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof offerKeys.escrowInfo>>) {
  const offerId = queryKey[2];

  const { result: fundingStatus, error: err } =
    await peachAPI.private.offer.getEscrowInfo({ offerId });
  if (!fundingStatus || err) {
    error("Could not fetch funding info for offer", offerId, err?.error);
    throw new Error(err?.error);
  }
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: offerKeys.detail(offerId),
      exact: true,
    }),
    queryClient.invalidateQueries({ queryKey: offerKeys.summaries() }),
  ]);
  return fundingStatus;
}
