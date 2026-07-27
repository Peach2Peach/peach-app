import { useCallback } from "react";
import { Chain } from "../../../../peach-api/src/@types/offer";
import { useTradingAmountLimits } from "./useTradingAmountLimits";

export const useRestrictSatsAmount = (
  type: "sell" | "buy",
  chain: Chain = "mainchain",
) => {
  const [minAmount, maxAmount] = useTradingAmountLimits(type, chain);

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
