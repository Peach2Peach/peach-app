import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIFTEEN_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export function useSellOfferTradeRequestBySelfUser({
  sellOfferId,
}: {
  sellOfferId: string;
}) {
  const queryData = useQuery({
    queryKey: ["useSellOfferTradeRequestBySelfUser", sellOfferId],
    queryFn: getSellOfferTradeRequestBySelfUser,
    refetchInterval: FIFTEEN_SECONDS,
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

  return result ? true : false;
}
