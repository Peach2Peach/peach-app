import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Placeholder } from "../../components/Placeholder";
import { TouchableIcon } from "../../components/TouchableIcon";
import tw from "../../styles/tailwind";
import { peachAPI } from "../../utils/peachAPI";
import { SellOfferSummaryIdCard } from "../explore/OfferSummaryCard";
import { MarketInfo } from "../offerPreferences/components/MarketInfo";

export function ExpressBuy({
  requestingOfferId,
}: {
  requestingOfferId?: string;
}) {
  const { data } = useQuery({
    queryKey: ["expressBuy"],
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getSellOfferSummaryIds();
      if (error || !result) {
        throw new Error(error?.message || "Sell offer summary ids not found");
      }
      return result;
    },
  });

  return (
    <PeachScrollView style={tw`grow`} onStartShouldSetResponder={() => true}>
      <View style={tw`flex-row items-center justify-between`}>
        <Placeholder style={tw`w-6 h-6`} />
        <MarketInfo type="sellOffers" />
        <TouchableIcon id="sliders" />
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
