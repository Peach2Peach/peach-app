import { View } from "react-native";
import { Button } from "../../components/buttons/Button";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useExpressBuySellOffers } from "../../hooks/query/peach069/useExpressBuySellOffers";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { ExpressBuySorters } from "../../popups/sorting/ExpressBuySorters";
import { useOfferPreferences } from "../../store/offerPreferenes";
import tw from "../../styles/tailwind";
import { headerIcons } from "../../utils/layout/headerIcons";

export function ExpressBuyBrowseSellOffers() {
  const title = "Express Buy: Browse Sell Offers";

  const expressBuyFilterByAmountRange = useOfferPreferences(
    (state) => state.expressBuyFilterByAmountRange,
  );

  const [
    expressBuyFilterByCurrencyList,
    expressBuyFilterByPaymentMethodList,
    expressBuyFilterMaxPremium,
    expressBuyOffersSorter,
  ] = useOfferPreferences((state) => [
    state.expressBuyFilterByCurrencyList,
    state.expressBuyFilterByPaymentMethodList,
    state.expressBuyFilterMaxPremium,
    state.expressBuyOffersSorter,
  ]);

  const { sellOffers, isLoading } = useExpressBuySellOffers(
    expressBuyFilterByAmountRange[0],
    expressBuyFilterByAmountRange[1],
    expressBuyFilterByCurrencyList,
    expressBuyFilterByPaymentMethodList.map((obj) => obj.id),
    expressBuyFilterMaxPremium,
    expressBuyOffersSorter,
  );
  const navigation = useStackNavigation();

  const setPopup = useSetPopup();

  const showSortAndFilterPopup = () => setPopup(<ExpressBuySorters />);

  const expressBuyHeaderIcons = [
    { ...headerIcons.expressFlowSorter, onPress: showSortAndFilterPopup },
    {
      ...headerIcons["filter"],
      onPress: () => {
        navigation.navigate("expressBuyFilters");
      },
    },
  ];

  return (
    <Screen header={<Header title={title} icons={expressBuyHeaderIcons} />}>
      <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
        <PeachText>All Sell Offers 0.69</PeachText>
        <>
          {!isLoading &&
            sellOffers !== undefined &&
            sellOffers.map((item, index) => {
              return (
                <>
                  <PeachText>-------</PeachText>
                  <PeachText>ID: {item.id}</PeachText>
                  <PeachText>User: {item.user.id}</PeachText>
                  <PeachText>Amount: {item.amount}</PeachText>
                  <PeachText>Premium: {item.premium}</PeachText>
                  <PeachText>
                    MeansOfPayment: {JSON.stringify(item.meansOfPayment)}
                  </PeachText>
                  <View style={tw`flex-row gap-10px`}>
                    <Button
                      style={[tw`bg-error-main`]}
                      onPress={() => {
                        navigation.navigate("expressBuyTradeRequest", {
                          offerId: String(item.id),
                        });
                      }}
                    >
                      go to page
                    </Button>
                  </View>
                  <PeachText>-------</PeachText>
                </>
              );
            })}
        </>
      </PeachScrollView>
    </Screen>
  );
}
