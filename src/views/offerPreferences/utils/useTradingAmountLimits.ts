import { useMemo } from "react";
import { useMarketPrices } from "../../../hooks/query/useMarketPrices";
import { getTradingAmountLimits } from "../../../utils/market/getTradingAmountLimits";

export const useTradingAmountLimits = (type: "buy" | "sell") => {
  const { data } = useMarketPrices();
  const range = useMemo(
    () => getTradingAmountLimits(data?.CHF || 1, type),
    [data?.CHF, type],
  );
  return range;
};
