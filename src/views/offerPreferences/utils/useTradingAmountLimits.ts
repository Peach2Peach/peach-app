import { useMemo } from "react";
import { SATSINBTC } from "../../../constants";
import { useMarketPrices } from "../../../hooks/query/useMarketPrices";
import { ceil } from "../../../utils/math/ceil";
import { floor } from "../../../utils/math/floor";

const FALLBACK_BITCOIN_PRICE = 1000000;
export const useTradingAmountLimits = (type: "buy" | "sell") => {
  const { data } = useMarketPrices();
  const range = useMemo(
    () => getTradingAmountLimits(data?.CHF || FALLBACK_BITCOIN_PRICE, type),
    [data?.CHF, type],
  );
  return range;
};

const MIN_AMOUNT = 10;
const MAX_SELL_AMOUNT = 800;
const MAX_BUY_AMOUNT = 1000;
const rangeSellInCHF = [MIN_AMOUNT, MAX_SELL_AMOUNT];
const rangeBuyInCHF = [MIN_AMOUNT, MAX_BUY_AMOUNT];
const digitsToRound = 4;

function getTradingAmountLimits(btcPriceCHF: number, type: "buy" | "sell") {
  const range = type === "buy" ? rangeBuyInCHF : rangeSellInCHF;
  return [
    ceil((range[0] / btcPriceCHF) * SATSINBTC, -digitsToRound),
    floor((range[1] / btcPriceCHF) * SATSINBTC, -digitsToRound),
  ] as const;
}
