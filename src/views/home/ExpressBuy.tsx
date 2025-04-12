import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Placeholder } from "../../components/Placeholder";
import { TouchableIcon } from "../../components/TouchableIcon";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { SellSorters } from "../../popups/sorting/SellSorters";
import { useOfferPreferences } from "../../store/offerPreferenes";
import tw from "../../styles/tailwind";
import { peachAPI } from "../../utils/peachAPI";
import { SellOfferSummaryIdCard } from "../explore/OfferSummaryCard";
import { MarketInfo } from "../offerPreferences/components/MarketInfo";

export function ExpressBuy({
  requestingOfferId,
}: {
  requestingOfferId?: string;
}) {
  const defaultSellSorter = useOfferPreferences(
    (state) => state.sortBy.sellOffer[0],
  );
  const { data } = useQuery({
    queryKey: ["expressBuy", defaultSellSorter],
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getSellOfferSummaryIds({
          sortBy: defaultSellSorter,
        });
      if (error || !result) {
        throw new Error(error?.message || "Sell offer summary ids not found");
      }
      return result;
    },
  });

  const setPopup = useSetPopup();

  const showSortAndFilterPopup = () => setPopup(<SellSorters />);

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
