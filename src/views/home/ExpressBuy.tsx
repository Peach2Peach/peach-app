import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { ActivityIndicator, View } from "react-native";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Placeholder } from "../../components/Placeholder";
import { TouchableIcon } from "../../components/TouchableIcon";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { BuySorters } from "../../popups/sorting/BuySorters";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { useExpressBuyFilterPreferences } from "../../store/useExpressBuyFilterPreferences/useExpressBuyFilterPreferences";
import tw from "../../styles/tailwind";
import { peachAPI } from "../../utils/peachAPI";
import { SellOfferSummaryIdCard } from "../explore/OfferSummaryCard";
import { MarketInfo } from "../offerPreferences/components/MarketInfo";

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
  );

  const { data, refetch } = useQuery({
    queryKey: ["expressBuy", defaultBuyOfferSorter],
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getSellOfferSummaryIds({
          sortBy: defaultBuyOfferSorter,
          amount: requestingOfferId ? undefined : [minAmount, maxAmount],
          maxPremium: requestingOfferId ? undefined : maxPremium,
        });
      if (error || !result) {
        throw new Error(error?.message || "Sell offer summary ids not found");
      }
      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * 1000,
  });

  useFocusEffect(
    useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const setPopup = useSetPopup();

  const showSortAndFilterPopup = () => setPopup(<BuySorters />);

  return (
    <PeachScrollView style={tw`grow`} onStartShouldSetResponder={() => true}>
      <View style={tw`flex-row items-center justify-between`}>
        <Placeholder style={tw`w-6 h-6`} />
        <MarketInfo type="sellOffers" />
        <TouchableIcon id="sliders" onPress={showSortAndFilterPopup} />
      </View>
      {!data ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={tw`gap-10px`} key={"sellOfferSummaryCards"}>
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
