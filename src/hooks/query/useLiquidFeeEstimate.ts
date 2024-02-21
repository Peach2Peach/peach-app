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
const getFeeEstimateQuery = async () => {
  const { result, error: err } = await peachAPI.public.liquid.getFeeEstimate();
  if (err) throw new Error(err.error);
  return result;
};

export const useLiquidFeeEstimate = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["feeEstimate", "liquid"],
    queryFn: getFeeEstimateQuery,
    refetchInterval: MSINAMINUTE,
  });
  const estimatedFees = data || placeholderFees;
  return { estimatedFees, isLoading, error };
};
