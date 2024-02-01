import { SATSINBTC } from "../../constants";
import { round } from "../math/round";

export const convertFiatToSats = (amount: number, bitcoinPrice: number) =>
  round((amount / bitcoinPrice) * SATSINBTC);
