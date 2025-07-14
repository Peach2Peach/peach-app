import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIFTEEN_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export function useSellOfferTradeRequestBySelfUser({
  sellOfferId,
  isEnabled = true,
}: {
  sellOfferId: string;
  isEnabled?: boolean;
}) {
  const queryData = useQuery({
    queryKey: ["useSellOfferTradeRequestBySelfUser", sellOfferId],
    queryFn: getSellOfferTradeRequestBySelfUser,
    refetchInterval: FIFTEEN_SECONDS,
    enabled: isEnabled,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return queryData;
}

async function getSellOfferTradeRequestBySelfUser({
  queryKey,
}: QueryFunctionContext) {
  const [, sellOfferId] = queryKey;
  const { result, error } =
    await peachAPI.private.peach069.getSellOfferTradeRequestPerformedById({
      sellOfferId,
    });

  return result !== undefined ? result : null;
}
