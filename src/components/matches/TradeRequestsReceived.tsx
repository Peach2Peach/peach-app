import { View, useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SellOffer69TradeRequest } from "../../../peach-api/src/@types/offer";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useIsMediumScreen } from "../../hooks/useIsMediumScreen";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { BTCAmount } from "../bitcoin/BTCAmount";
import { PeachText } from "../text/PeachText";
import { TradeRequestReceived } from "./TradeRequestReceived";
import { getPremiumColor } from "./utils/getPremiumColor";

const MEDIUM_SCREEN_OFFSET = 48;
const SMALL_SCREEN_OFFSET = 40;

export const TradeRequestsReceived = ({
  offer,
  tradeRequests,
  acceptTradeRequestFunction,
  rejectTradeRequestFunction,
  refetchTradeRequests,
}: {
  offer: SellOffer;
  tradeRequests: SellOffer69TradeRequest[];
  acceptTradeRequestFunction: Function;
  rejectTradeRequestFunction: Function;
  refetchTradeRequests: Function;
}) => {
  const { width } = useWindowDimensions();
  const isMediumScreen = useIsMediumScreen();

  const { user: selfUser } = useSelfUser();
  const navigation = useStackNavigation();

  return (
    <View style={tw`h-full`}>
      <TradeRequestsInformation offer={offer} tradeRequests={tradeRequests} />
      {selfUser && (
        <View style={tw`shrink`}>
          <Carousel
            {...{ width }}
            loop={false}
            snapEnabled
            mode="parallax"
            style={tw`grow`}
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: isMediumScreen
                ? MEDIUM_SCREEN_OFFSET
                : SMALL_SCREEN_OFFSET,
            }}
            data={tradeRequests}
            renderItem={({ item }) => (
              <TradeRequestReceived
                offer={offer}
                tradeRequest={item}
                acceptTradeRequestFunction={() => {
                  acceptTradeRequestFunction(offer, item, selfUser, navigation);
                }}
                rejectTradeRequestFunction={async () => {
                  await rejectTradeRequestFunction(
                    offer.id,
                    item.userId,
                    navigation,
                  );
                  refetchTradeRequests();
                }}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

function TradeRequestsInformation({
  offer,
  tradeRequests,
}: {
  offer: SellOffer;
  tradeRequests: SellOffer69TradeRequest[];
}) {
  const offerId = offer.id;

  const color = getPremiumColor(offer.premium || 0, false);

  return (
    <View>
      <PeachText style={tw`text-center h4 text-primary-main`}>
        {i18n(
          `search.youGot${tradeRequests.length === 1 ? "ATradeRequest" : "TradeRequests"}`,
        )}
      </PeachText>
      <PeachText style={tw`text-center body-l text-black-65`}>
        {i18n("search.sellOffer")}:
      </PeachText>
      <View style={tw`flex-row items-center justify-center`}>
        <BTCAmount amount={offer.amount} size="medium" />
        {offer.premium !== undefined && (
          <PeachText style={[tw`leading-loose body-l`, color]}>
            {" "}
            ({offer.premium > 0 ? "+" : ""}
            {String(offer.premium)}%)
          </PeachText>
        )}
      </View>
    </View>
  );
}
