import { SATSINBTC } from "../constants";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { round } from "../utils/math/round";
import { useMarketPrices } from "./query/useMarketPrices";

export const useBitcoinPrices = (
  sats: number = 0,
  customCurrency: Currency | undefined = undefined,
) => {
  const stateDisplayCurrency = useSettingsStore(
    (state) => state.displayCurrency,
  );
  const { data: prices } = useMarketPrices();
  const displayCurrency = customCurrency
    ? customCurrency
    : stateDisplayCurrency;
  const bitcoinPrice = prices?.[displayCurrency] ?? 0;
  const moscowTime = Math.round(SATSINBTC / bitcoinPrice);
  const fiatPrice = round((bitcoinPrice / SATSINBTC) * sats, 2);

  return {
    bitcoinPrice,
    moscowTime,
    displayCurrency,
    fiatPrice,
  };
};
