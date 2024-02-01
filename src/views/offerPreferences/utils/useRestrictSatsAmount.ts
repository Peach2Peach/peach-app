import { useCallback } from "react";
import { useTradingAmountLimits } from "./useTradingAmountLimits";

export const useRestrictSatsAmount = (type: "sell" | "buy") => {
  const [minAmount, maxAmount] = useTradingAmountLimits(type);

  const restrictAmount = useCallback(
    (amount: number) => {
      if (amount < minAmount) {
        return minAmount;
      } else if (amount > maxAmount) {
        return maxAmount;
      }
      return amount;
    },
    [minAmount, maxAmount],
  );
  return restrictAmount;
};
