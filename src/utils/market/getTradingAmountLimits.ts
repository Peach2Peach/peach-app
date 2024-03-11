import { SATSINBTC } from "../../constants";
import { ceil } from "../math/ceil";
import { floor } from "../math/floor";

const MIN_BUY_AMOUNT = 5;
const MAX_BUY_AMOUNT = 1000;
const MIN_SELL_AMOUNT = 10;
const MAX_SELL_AMOUNT = 800;
const rangeSellInCHF = [MIN_SELL_AMOUNT, MAX_SELL_AMOUNT];
const rangeBuyInCHF = [MIN_BUY_AMOUNT, MAX_BUY_AMOUNT];
const digitsToRound = 4;

export const getTradingAmountLimits = (
  btcPriceCHF: number,
  type: "buy" | "sell",
) => {
  const range = type === "buy" ? rangeBuyInCHF : rangeSellInCHF;
  return [
    ceil((range[0] / btcPriceCHF) * SATSINBTC, -digitsToRound),
    floor((range[1] / btcPriceCHF) * SATSINBTC, -digitsToRound),
  ] as const;
};
