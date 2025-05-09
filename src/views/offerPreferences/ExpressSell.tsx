import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Placeholder } from "../../components/Placeholder";
import { TouchableIcon } from "../../components/TouchableIcon";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { TIME_UNTIL_REFRESH_LONGER_SECONDS } from "../../constants";
import { SellSorters } from "../../popups/sorting/SellSorters";
import { useOfferPreferences } from "../../store/offerPreferenes";
import tw from "../../styles/tailwind";
import { peachAPI } from "../../utils/peachAPI";
import { BuyOfferSummaryIdCard } from "../explore/OfferSummaryCard";
import { MarketInfo } from "./components/MarketInfo";

export function ExpressSell({
  requestingOfferId,
}: {
  requestingOfferId?: string;
}) {
  const defaultSellOfferSorter = useOfferPreferences(
    (state) => state.sortBy.sellOffer[0],
  );
  const { data } = useQuery({
    queryKey: ["expressSell", defaultSellOfferSorter],
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getBuyOfferSummaryIds({
          sortBy: defaultSellOfferSorter,
        });
      if (error || !result) {
        throw new Error(error?.message || "Buy offer summary ids not found");
      }
      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_LONGER_SECONDS * 1000,
  });

  const setPopup = useSetPopup();

  const showSortAndFilterPopup = () => setPopup(<SellSorters />);

  return (
    <PeachScrollView style={tw`grow`} onStartShouldSetResponder={() => true}>
      <View style={tw`flex-row items-center justify-between`}>
        <Placeholder style={tw`w-6 h-6`} />
        <MarketInfo type="buyOffers" />
        <TouchableIcon
          id="sliders"
          onPress={showSortAndFilterPopup}
          iconColor={tw.color("success-main")}
        />
      </View>
      {!data ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={tw`gap-10px`} key={"sellOfferSummaryCards"}>
          {data.map((offerId) => (
            <BuyOfferSummaryIdCard
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
