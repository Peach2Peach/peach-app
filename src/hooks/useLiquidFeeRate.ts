import { isNumber } from "../utils/validation/isNumber";
import { useLiquidFeeEstimate } from "./query/useLiquidFeeEstimate";
import { useSelfUser } from "./query/useSelfUser";

export const useLiquidFeeRate = () => {
  const { user } = useSelfUser();
  const feeRate = user?.feeRate; // TODO use liquid fee rate
  const { estimatedFees } = useLiquidFeeEstimate();

  if (feeRate && isNumber(feeRate)) return feeRate;
  if (feeRate && !isNumber(feeRate) && estimatedFees[feeRate])
    return estimatedFees[feeRate];
  return estimatedFees.halfHourFee;
};
