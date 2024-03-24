import { SATSINBTC } from "../../../constants";
import { round } from "../../../utils/math/round";

export const getFiatPrice = (amount: number, btcPrice: number) =>
  round(((btcPrice || 0) / SATSINBTC) * amount, 2).toFixed(2);
