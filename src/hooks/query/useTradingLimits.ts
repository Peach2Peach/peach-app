import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { defaultLimits } from "../../utils/account/account";
import { useMarketPrices } from "../query/useMarketPrices";
import { useCHFTradingLimits } from "./useCHFTradingLimits";

export const useTradingLimits = () => {
  const { data: limits } = useCHFTradingLimits();
  const { data: marketPrices } = useMarketPrices();
  const displayCurrency = useSettingsStore((state) => state.displayCurrency);

  const displayPrice = marketPrices?.[displayCurrency];
  const exchangeRate =
    displayPrice && marketPrices.CHF ? displayPrice / marketPrices.CHF : 1;

  const roundedDisplayLimits = limits
    ? {
        dailyAmount: limits.dailyAmount * exchangeRate,
        daily: exchangeRate * limits.daily,
        monthlyAnonymous: limits?.monthlyAnonymous * exchangeRate,
        monthlyAnonymousAmount: exchangeRate * limits?.monthlyAnonymousAmount,
        yearlyAmount: limits.yearlyAmount * exchangeRate,
        yearly: exchangeRate * limits.yearly,
      }
    : defaultLimits;

  return roundedDisplayLimits;
};
