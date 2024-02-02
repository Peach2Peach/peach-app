import { useQuery } from "@tanstack/react-query";
import { MSINAMINUTE } from "../../constants";
import { peachAPI } from "../../utils/peachAPI";

export const placeholderFees = {
  fastestFee: 1,
  halfHourFee: 1,
  hourFee: 1,
  economyFee: 1,
  minimumFee: 1,
};

export const bitcoinQueryKeys = {
  feeEstimate: ["feeEstimate"],
};

export const useFeeEstimate = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: bitcoinQueryKeys.feeEstimate,
    queryFn: getFeeEstimateQuery,
    refetchInterval: MSINAMINUTE,
  });
  const estimatedFees = data || placeholderFees;
  return { estimatedFees, isLoading, error };
};

async function getFeeEstimateQuery() {
  const { result, error: err } = await peachAPI.public.bitcoin.getFeeEstimate();
  if (err) throw new Error(err.error);
  return result;
}
