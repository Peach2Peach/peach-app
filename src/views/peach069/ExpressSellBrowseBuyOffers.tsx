import { View } from "react-native";
import { Button } from "../../components/buttons/Button";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useExpressSellBuyOffers } from "../../hooks/query/peach069/useExpressSellBuyOffers";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useOfferPreferences } from "../../store/offerPreferenes";
import tw from "../../styles/tailwind";
import { headerIcons } from "../../utils/layout/headerIcons";

export function ExpressSellBrowseBuyOffers() {
  const title = "Express Sell: Browse Buy Offers";
  const expressSellFilterByAmountRange = useOfferPreferences(
    (state) => state.expressSellFilterByAmountRange,
  );

  const { buyOffers, isLoading } = useExpressSellBuyOffers(
    expressSellFilterByAmountRange[0],
    expressSellFilterByAmountRange[1],
  );
  const navigation = useStackNavigation();

  const expressSellHeaderIcons = [
    {
      ...headerIcons["filter"],
      onPress: () => {
        navigation.navigate("expressSellFilters");
      },
    },
  ];

  return (
    <Screen header={<Header title={title} icons={expressSellHeaderIcons} />}>
      <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
        <PeachText>All Buy Offers 0.69</PeachText>
        <>
          {!isLoading &&
            buyOffers !== undefined &&
            buyOffers.map((item, index) => {
              return (
                <>
                  <PeachText>-------</PeachText>
                  <PeachText>ID: {item.id}</PeachText>
                  <PeachText>User: {item.userId}</PeachText>
                  <PeachText>Amount: {item.amountSats}</PeachText>
                  <PeachText>Premium: {item.premium}</PeachText>
                  <PeachText>
                    MeansOfPayment: {JSON.stringify(item.meansOfPayment)}
                  </PeachText>
                  <View style={tw`flex-row gap-10px`}>
                    <Button
                      style={[tw`bg-error-main`]}
                      onPress={() => {
                        navigation.navigate("expressSellTradeRequest", {
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
