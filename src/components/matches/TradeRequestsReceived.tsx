import { View, useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import {
  BuyOffer69,
  BuyOffer69TradeRequest,
  SellOffer69TradeRequest,
} from "../../../peach-api/src/@types/offer";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useIsMediumScreen } from "../../hooks/useIsMediumScreen";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { BTCAmount } from "../bitcoin/BTCAmount";
import { PeachText } from "../text/PeachText";
import { TradeRequestReceived } from "./TradeRequestReceived";
import { getPremiumColor } from "./utils/getPremiumColor";
import { useHandleError } from "./utils/useHandleError";

const MEDIUM_SCREEN_OFFSET = 48;
const SMALL_SCREEN_OFFSET = 40;

export const TradeRequestsReceived = ({
  offer,
  tradeRequests,
  acceptTradeRequestFunction,
  rejectTradeRequestFunction,
  refetchTradeRequests,
  goToChat,
  type,
}: {
  offer: SellOffer | BuyOffer69;
  tradeRequests: SellOffer69TradeRequest[] | BuyOffer69TradeRequest[];
  acceptTradeRequestFunction: Function;
  rejectTradeRequestFunction: Function;
  refetchTradeRequests: Function;
  goToChat: Function;
  type: "sell" | "buy";
}) => {
  const handleError = useHandleError();
  const { width } = useWindowDimensions();
  const isMediumScreen = useIsMediumScreen();

  const { user: selfUser } = useSelfUser();
  const navigation = useStackNavigation();

  return (
    <View style={tw`h-full`}>
      <TradeRequestsInformation
        offer={offer}
        tradeRequests={tradeRequests}
        type={type}
      />
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
                  acceptTradeRequestFunction(
                    offer,
                    item,
                    selfUser,
                    navigation,
                    handleError,
                  );
                }}
                rejectTradeRequestFunction={async () => {
                  await rejectTradeRequestFunction(offer.id, item.userId);
                  refetchTradeRequests();
                }}
                goToChatFunction={() => {
                  goToChat(navigation, offer.id, item.userId);
                }}
                type={type}
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
  type,
}: {
  offer: SellOffer | BuyOffer69;
  tradeRequests: SellOffer69TradeRequest[] | BuyOffer69TradeRequest[];
  type: "sell" | "buy";
}) {
  const color = getPremiumColor(offer.premium || 0, false);

  return (
    <View>
      <PeachText
        style={tw`text-center h4 ${type === "sell" ? "text-primary-main" : "text-success-main"}`}
      >
        {i18n(
          `search.youGot${tradeRequests.length === 1 ? "ATradeRequest" : "TradeRequests"}`,
        )}
      </PeachText>
      <PeachText style={tw`text-center body-l text-black-65`}>
        {type === "sell" ? i18n("search.sellOffer") : i18n("search.buyOffer")}:
      </PeachText>
      <View style={tw`flex-row items-center justify-center`}>
        <BTCAmount
          amount={
            type === "sell"
              ? (offer as SellOffer).amount
              : (offer as BuyOffer69).amountSats ?? 0
          }
          size="medium"
        />
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
