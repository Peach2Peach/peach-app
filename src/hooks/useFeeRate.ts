import { isNumber } from "../utils/validation/isNumber";
import { useFeeEstimate } from "./query/useFeeEstimate";
import { useSelfUser } from "./query/useSelfUser";

export const useFeeRate = () => {
  const { user } = useSelfUser();
  const feeRate = user?.feeRate;
  const { estimatedFees } = useFeeEstimate();

  if (feeRate && isNumber(feeRate)) return feeRate;
  if (feeRate && !isNumber(feeRate) && estimatedFees[feeRate])
    return estimatedFees[feeRate];
  return estimatedFees.halfHourFee;
};
