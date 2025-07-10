import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { FIFTEEN_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export function useBuyOfferTradeRequestBySelfUser({
  buyOfferId,
}: {
  buyOfferId: number;
}) {
  const queryData = useQuery({
    queryKey: ["useBuyOfferTradeRequestBySelfUser", buyOfferId],
    queryFn: getBuyOfferTradeRequestBySelfUser,
    refetchInterval: FIFTEEN_SECONDS,
  });

  return queryData;
}

async function getBuyOfferTradeRequestBySelfUser({
  queryKey,
}: QueryFunctionContext) {
  const [, buyOfferId] = queryKey;
  const { result, error } =
    await peachAPI.private.peach069.getBuyOfferTradeRequestPerformedById({
      buyOfferId,
    });

  return result ? true : false;
}
