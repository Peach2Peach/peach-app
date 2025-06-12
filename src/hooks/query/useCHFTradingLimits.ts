import { useQuery } from "@tanstack/react-query";
import { peachAPI } from "../../utils/peachAPI";
import { userKeys } from "./useSelfUser";

export function useCHFTradingLimits() {
  return useQuery({
    queryKey: userKeys.tradingLimits(),
    queryFn: tradingLimitQuery,
  });
}

async function tradingLimitQuery() {
  const { result, error: err } = await peachAPI.private.user.getTradingLimit();
  if (err) {
    throw new Error(err.error || "Could not fetch trading limits");
  }
  return result;
}
