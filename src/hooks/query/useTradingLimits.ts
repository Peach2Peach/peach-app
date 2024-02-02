import { useQuery } from "@tanstack/react-query";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { defaultLimits } from "../../utils/account/account";
import { peachAPI } from "../../utils/peachAPI";
import { useMarketPrices } from "../query/useMarketPrices";
import { userKeys } from "./useSelfUser";

const tradingLimitQuery = async () => {
  const { result, error: err } = await peachAPI.private.user.getTradingLimit();
  if (err) {
    throw new Error(err.error || "Could not fetch trading limits");
  }
  return result;
};
export const useTradingLimits = () => {
  const { data: limits } = useQuery({
    queryKey: userKeys.tradingLimits(),
    queryFn: tradingLimitQuery,
  });
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
