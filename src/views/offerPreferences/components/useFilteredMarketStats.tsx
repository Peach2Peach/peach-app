import {
  QueryFunctionContext,
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";
import { MeansOfPayment } from "../../../../peach-api/src/@types/payment";
import { marketKeys } from "../../../hooks/query/useMarketPrices";
import { round } from "../../../utils/math/round";
import { peachAPI } from "../../../utils/peachAPI";
import { isDefined } from "../../../utils/validation/isDefined";

type Params = {
  type: "bid" | "ask";
  escrowType?: EscrowType;
  meansOfPayment?: MeansOfPayment;
  maxPremium?: number;
  minReputation?: number;
  buyAmountRange?: [number, number];
  sellAmount?: number;
};

export function useFilteredMarketStats({
  type,
  escrowType,
  meansOfPayment,
  maxPremium,
  minReputation,
  buyAmountRange,
  sellAmount,
}: Params) {
  const queryData = useSearchOfferSummaries({
    type,
    escrowType,
    meansOfPayment,
    maxPremium,
    minReputation,
  });

  const offersWithinRange = useMemo(() => {
    if (!queryData.data?.offers) return [];
    if (type === "bid" && sellAmount) {
      return queryData.data.offers.filter(
        (offer) =>
          "amount" in offer &&
          typeof offer.amount !== "number" &&
          offer.amount[0] <= sellAmount &&
          offer.amount[1] >= sellAmount,
      );
    } else if (type === "ask" && buyAmountRange) {
      const [min, max] = buyAmountRange;
      return queryData.data.offers.filter(
        (offer) =>
          "amount" in offer &&
          typeof offer.amount === "number" &&
          offer.amount >= min &&
          offer.amount <= max,
      );
    }
    return queryData.data.offers;
  }, [buyAmountRange, queryData?.data?.offers, sellAmount, type]);

  const averagePremium = useMemo(() => {
    const premiums = offersWithinRange
      .map((offer) => ("premium" in offer ? offer.premium : undefined))
      .filter(isDefined);
    const avg = premiums.reduce((a, b) => a + b, 0) / premiums.length;
    return round(avg, 2);
  }, [offersWithinRange]);

  return {
    ...queryData,
    data: { ...queryData.data, offersWithinRange, averagePremium },
  };
}

function useSearchOfferSummaries(
  filter: Pick<
    Params,
    "type" | "escrowType" | "meansOfPayment" | "maxPremium" | "minReputation"
  >,
) {
  return useQuery({
    queryKey: marketKeys.filteredOfferStats(filter),
    queryFn: getSearchOfferSummaries,
    placeholderData: keepPreviousData,
  });
}

async function getSearchOfferSummaries({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof marketKeys.filteredOfferStats>>) {
  const requestBody = queryKey[3];
  const { result } =
    await peachAPI.private.offer.searchOfferSummaries(requestBody);
  return result;
}
