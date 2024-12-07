import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Placeholder } from "../../components/Placeholder";
import { TouchableIcon } from "../../components/TouchableIcon";
import tw from "../../styles/tailwind";
import { peachAPI } from "../../utils/peachAPI";
import { BuyOfferSummaryIdCard } from "../explore/OfferSummaryCard";
import { MarketInfo } from "./components/MarketInfo";

export function ExpressSell() {
  const { data } = useQuery({
    queryKey: ["expressSell"],
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getBuyOfferSummaryIds();
      if (error || !result) {
        throw new Error(error?.message || "Buy offer summary ids not found");
      }
      return result;
    },
  });

  return (
    <PeachScrollView style={tw`grow`} onStartShouldSetResponder={() => true}>
      <View style={tw`flex-row items-center justify-between`}>
        <Placeholder style={tw`w-6 h-6`} />
        <MarketInfo type="buyOffers" />
        <TouchableIcon id="sliders" iconColor={tw.color("success-main")} />
      </View>
      {!data ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={tw`gap-10px`} key={"sellOfferSummaryCards"}>
          {data.map((offerId) => (
            <BuyOfferSummaryIdCard key={offerId} offerId={offerId} />
          ))}
        </View>
      )}
    </PeachScrollView>
  );
}
