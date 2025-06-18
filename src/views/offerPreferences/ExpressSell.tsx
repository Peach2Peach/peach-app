import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { shallow } from "zustand/shallow";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Placeholder } from "../../components/Placeholder";
import { TouchableIcon } from "../../components/TouchableIcon";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { MSINASECOND, TIME_UNTIL_REFRESH_SECONDS } from "../../constants";
import { useRefreshOnFocus } from "../../hooks/query/useRefreshOnFocus";
import { useSellOfferPreferences } from "../../hooks/query/useSellOfferPreferences";
import { SellSorters } from "../../popups/sorting/SellSorters";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { useExpressSellFilterPreferences } from "../../store/useExpressSellFilterPreference/useExpressSellFilterPreference";
import tw from "../../styles/tailwind";
import { peachAPI } from "../../utils/peachAPI";
import { BuyOfferSummaryIdCard } from "../explore/OfferSummaryCard";
import { NoOffersMessage } from "../search/NoOffersMessage";
import { MarketInfo } from "./components/MarketInfo";

export function ExpressSell({
  requestingOfferId,
}: {
  requestingOfferId?: string;
}) {
  const defaultSellOfferSorter = useOfferPreferences(
    (state) => state.sortBy.sellOffer[0],
  );

  const [amount, premium] = useExpressSellFilterPreferences(
    (state) => [state.amount, state.premium],
    shallow,
  );

  const { data: requestingOffer } = useSellOfferPreferences(requestingOfferId);
  const meansOfPaymentOnExpressSellFilter = useOfferPreferences(
    (state) => state.meansOfPaymentOnExpressSellFilter,
  );

  const marketFilterAmount = requestingOffer ? requestingOffer.amount : amount;

  const marketFilterPremium = requestingOffer?.premium ?? premium;

  const { data, refetch } = useQuery({
    queryKey: ["expressSell", defaultSellOfferSorter],
    queryFn: async () => {
      const { result, error } =
        await peachAPI.private.offer.getBuyOfferSummaryIds({
          sortBy: defaultSellOfferSorter,
          matchSellOfferId: requestingOfferId,
          amount: requestingOfferId ? undefined : amount,
          minPremium: requestingOfferId ? undefined : premium,
          meansOfPayment: requestingOfferId
            ? undefined
            : meansOfPaymentOnExpressSellFilter,
        });
      if (error || !result) {
        throw new Error(error?.message || "Buy offer summary ids not found");
      }
      return result;
    },
    refetchInterval: TIME_UNTIL_REFRESH_SECONDS * MSINASECOND,
  });
  useRefreshOnFocus(refetch);

  const setPopup = useSetPopup();

  const showSortAndFilterPopup = () => setPopup(<SellSorters />);

  return (
    <PeachScrollView style={tw`grow`} onStartShouldSetResponder={() => true}>
      <View style={tw`flex-row items-center justify-between`}>
        {data?.length === 0 ? (
          <NoOffersMessage />
        ) : (
          <>
            <Placeholder style={tw`w-6 h-6`} />
            <MarketInfo
              type="buyOffers"
              meansOfPayment={requestingOffer?.meansOfPayment}
              maxPremium={marketFilterPremium}
              sellAmount={marketFilterAmount}
            />
            <TouchableIcon
              id="sliders"
              onPress={showSortAndFilterPopup}
              iconColor={tw.color("success-main")}
            />
          </>
        )}
      </View>
      {!data ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={tw`gap-10px`}>
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
