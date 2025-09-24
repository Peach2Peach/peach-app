import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { TEN_SECONDS } from "../../../constants";
import { peachAPI } from "../../../utils/peachAPI";

export function useBuyOfferTradeRequestBySelfUser({
  buyOfferId,
  isEnabled = true,
}: {
  buyOfferId: string;
  isEnabled?: boolean;
}) {
  const queryData = useQuery({
    queryKey: ["useBuyOfferTradeRequestBySelfUser", buyOfferId],
    queryFn: getBuyOfferTradeRequestBySelfUser,
    refetchInterval: TEN_SECONDS,
    enabled: isEnabled,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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

  return result === undefined ? null : result;
}
