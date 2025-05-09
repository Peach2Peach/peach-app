import { useQuery } from "@tanstack/react-query";
import { TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { offerKeys } from "../../hooks/query/offerKeys";
import { peachAPI } from "../../utils/peachAPI";

export function useTradeRequest(
  offerId: string,
  requestingOfferId?: string,
  // isSellOffer = false,
) {
  return useQuery({
    queryKey: offerKeys.tradeRequest(offerId),
    queryFn: async () => {
      const { result, error } = await peachAPI.private.offer.getTradeRequest({
        offerId,
        requestingOfferId,
      });
      if (error) throw new Error(error.error);

      // if (result && isSellOffer) {
      //   const offerResponse = await peachAPI.private.offer.getSellOfferSummary({
      //     offerId,
      //   });
      //   if (offerResponse.error) throw new Error(offerResponse.error.error);

      //   result.contract = offerResponse.result?.contract;
      //   result.online = offerResponse.result?.online;
      // } else {
      //   const offerResponse = await peachAPI.private.offer.getBuyOfferSummary({
      //     offerId,
      //   });
      //   if (offerResponse.error) throw new Error(offerResponse.error.error);

      //   result.contract = offerResponse.result?.contract;
      //   result.online = offerResponse.result?.online;
      // }

      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * 1000,
  });
}
