import { useFeeEstimate } from "../../hooks/query/useFeeEstimate";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { round } from "../../utils/math/round";

const ESCROW_RELEASE_SIZE = 173;
const FEE_WARNING_THRESHOLD = 0.1;
export function useMaxMiningFee(amount: number) {
  const { estimatedFees } = useFeeEstimate();
  const { user } = useSelfUser();
  const feeRate =
    user?.isBatchingEnabled === false
      ? user?.feeRate || "halfHourFee"
      : "halfHourFee";
  const feeRateAmount =
    typeof feeRate === "number" ? feeRate : estimatedFees[feeRate];
  const currentTotalFee = feeRateAmount * ESCROW_RELEASE_SIZE;

  const currentFeePercentage = round(currentTotalFee / amount, 2);
  const maxMiningFeeRate =
    currentFeePercentage > FEE_WARNING_THRESHOLD ? feeRateAmount : undefined;

  return { currentFeePercentage, maxMiningFeeRate };
}
