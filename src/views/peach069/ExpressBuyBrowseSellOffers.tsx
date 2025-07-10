import { View } from "react-native";
import { Button } from "../../components/buttons/Button";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { PeachText } from "../../components/text/PeachText";
import { useExpressBuySellOffers } from "../../hooks/query/peach069/useExpressBuySellOffers";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";

export function ExpressBuyBrowseSellOffers() {
  const title = "Express Buy: Browse Sell Offers";
  const { sellOffers, isLoading } = useExpressBuySellOffers();
  const navigation = useStackNavigation();

  return (
    <Screen header={<Header title={title} />}>
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
