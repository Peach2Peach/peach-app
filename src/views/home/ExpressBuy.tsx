import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { shallow } from "zustand/shallow";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Placeholder } from "../../components/Placeholder";
import { TouchableIcon } from "../../components/TouchableIcon";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { MSINASECOND, TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { useBuyOfferPreferences } from "../../hooks/query/useBuyOfferPreferences";
import { useRefreshOnFocus } from "../../hooks/query/useRefreshOnFocus";
import { BuySorters } from "../../popups/sorting/BuySorters";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { useExpressBuyFilterPreferences } from "../../store/useExpressBuyFilterPreferences/useExpressBuyFilterPreferences";
import tw from "../../styles/tailwind";
import { peachAPI } from "../../utils/peachAPI";
import { SellOfferSummaryIdCard } from "../explore/OfferSummaryCard";
import { MarketInfo } from "../offerPreferences/components/MarketInfo";
import { NoOffersMessage } from "../search/NoOffersMessage";

export function ExpressBuy({
  requestingOfferId,
}: {
  requestingOfferId?: string;
}) {
  const defaultBuyOfferSorter = useOfferPreferences(
    (state) => state.sortBy.buyOffer[0],
  );
  const [minAmount, maxAmount, maxPremium] = useExpressBuyFilterPreferences(
    (state) => [state.minAmount, state.maxAmount, state.maxPremium],
    shallow,
  );

  const { data: requestingOffer } = useBuyOfferPreferences(requestingOfferId);

  const amount: [number, number] = requestingOffer
    ? requestingOffer.amount
    : [minAmount, maxAmount];
  const marketFilterMaxPremium = requestingOffer
    ? requestingOffer.maxPremium
    : maxPremium;

  const { data, refetch } = useQuery({
    queryKey: ["expressBuy", defaultBuyOfferSorter],
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getSellOfferSummaryIds({
          amount,
          maxPremium: requestingOffer
            ? requestingOffer?.maxPremium || undefined
            : maxPremium,
          meansOfPayment: requestingOffer?.meansOfPayment,
          sortBy: defaultBuyOfferSorter,
        });
      if (error || !result) {
        throw new Error(error?.message || "Sell offer summary ids not found");
      }
      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * MSINASECOND,
  });

  useRefreshOnFocus(refetch);

  const setPopup = useSetPopup();

  const showSortAndFilterPopup = () => setPopup(<BuySorters />);

  return (
    <PeachScrollView style={tw`grow`} onStartShouldSetResponder={() => true}>
      <View style={tw`flex-row items-center justify-between`}>
        {data?.length === 0 ? (
          <NoOffersMessage />
        ) : (
          <>
            <Placeholder style={tw`w-6 h-6`} />
            <MarketInfo
              type="sellOffers"
              meansOfPayment={requestingOffer?.meansOfPayment}
              maxPremium={marketFilterMaxPremium || undefined}
              minReputation={requestingOffer?.minReputation || undefined}
              buyAmountRange={amount}
            />
            <TouchableIcon id="sliders" onPress={showSortAndFilterPopup} />
          </>
        )}
      </View>
      {!data ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={tw`gap-10px`}>
          {data.map((offerId) => (
            <SellOfferSummaryIdCard
              key={offerId}
              offerId={offerId}
              requestingOfferId={requestingOfferId}
            />
          ))}
        </View>
      )}
    </PeachScrollView>
  );
}
