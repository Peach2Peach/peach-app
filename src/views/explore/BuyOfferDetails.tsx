import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, View } from "react-native";
import { GetOfferResponseBody } from "../../../peach-api/src/public/offer/getOffer";
import { PeachScrollView } from "../../components/PeachScrollView";
import { PeachyBackground } from "../../components/PeachyBackground";
import { PeachyGradient } from "../../components/PeachyGradient";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { ConfirmSlider } from "../../components/inputs/confirmSlider/ConfirmSlider";
import { UndoTradeRequestButton } from "../../components/matches/buttons/UndoTradeRequestButton";
import { PaymentMethodSelector } from "../../components/matches/components/PaymentMethodSelector";
import { useInterruptibleFunction } from "../../components/matches/hooks/useInterruptibleFunction";
import { useTradeRequestBuyOffer } from "../../components/offer/useTradeRequestOffer";
import { PeachText } from "../../components/text/PeachText";
import { CENT, SATSINBTC } from "../../constants";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { usePaymentDataStore } from "../../store/usePaymentDataStore/usePaymentDataStore";
import tw from "../../styles/tailwind";
import { round } from "../../utils/math/round";
import { keys } from "../../utils/object/keys";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { getPaymentMethods } from "../../utils/paymentMethod/getPaymentMethods";
import { paymentMethodAllowedForCurrency } from "../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { PriceInfo } from "./BuyerPriceInfo";
import { PaidVia } from "./PaidVia";
import { UserCard } from "./UserCard";
import { canUserInstantTrade } from "./canUserInstantTrade";
import { useOffer } from "./useOffer";
import { useTradeRequest } from "./useTradeRequest";

export function BuyOfferDetails() {
  const { offerId, amount, premium, requestingOfferId } =
    useRoute<"buyOfferDetails">().params;
  const { data: offer, isLoading } = useOffer(offerId);

  return (
    <Screen header={`offer ${offerIdToHex(offerId)}`}>
      {isLoading || !offer ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <BuyOfferDetailsComponent
          offer={offer}
          amount={amount}
          premium={premium}
          requestingOfferId={requestingOfferId}
        />
      )}
    </Screen>
  );
}

function BuyOfferDetailsComponent({
  offer,
  amount,
  premium,
  requestingOfferId,
}: {
  offer: GetOfferResponseBody;
  amount: number;
  premium: number;
  requestingOfferId?: string;
}) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    keys(offer.meansOfPayment).at(0) || "CHF",
  );
  const allPaymentMethods = getPaymentMethods(offer.meansOfPayment);
  const allMethodsForCurrency = allPaymentMethods.filter((p) =>
    paymentMethodAllowedForCurrency(p, selectedCurrency),
  );
  const paymentData = usePaymentDataStore((state) =>
    Object.values(state.paymentData),
  );
  const dataForCurrency = paymentData.filter((d) =>
    allMethodsForCurrency.includes(d.type),
  );
  const defaultData =
    dataForCurrency.length === 1 ? dataForCurrency[0] : undefined;
  const [selectedPaymentData, setSelectedPaymentData] = useState(defaultData);
  const { data } = useTradeRequest(offer.id);
  const [showMatchedCard, setShowMatchedCard] = useState<boolean>(
    !!data?.tradeRequest,
  );
  const isRequested = !!data?.tradeRequest || showMatchedCard;
  const [isInstant, setIsInstant] = useState<boolean>(false);
  const { instantTradeCriteria } = offer;
  const { user } = useSelfUser();

  useEffect(() => {
    if (user !== undefined) {
      setIsInstant(
        !!(
          instantTradeCriteria &&
          canUserInstantTrade(user, instantTradeCriteria)
        ),
      );
    }
  }, [user, instantTradeCriteria]);

  const { mutate } = useTradeRequestBuyOffer(
    selectedCurrency,
    selectedPaymentData,
    offer.id,
    offer.user,
    premium,
    amount,
    requestingOfferId,
  );

  const MATCH_DELAY = 5000;
  const tradeOffer = (instant: boolean) => {
    mutate(instant, {
      onError: () => {
        setShowMatchedCard(false);
      },
    });
  };
  const { interruptibleFn: tradeFunction, interrupt: interruptMatchFunction } =
    useInterruptibleFunction(() => {
      tradeOffer(isInstant);
    }, MATCH_DELAY);
  const onInterruptTradeRequest = () => {
    interruptMatchFunction();
    setShowMatchedCard(false);
  };

  const onTradePress = () => {
    setShowMatchedCard(true);
    tradeFunction();
  };

  return (
    <View style={tw`items-center justify-between gap-8 grow`}>
      <PeachScrollView contentStyle={tw`gap-8 grow`}>
        <View style={tw`overflow-hidden rounded-2xl`}>
          {isRequested && <PeachyBackground />}
          <View style={tw`gap-8 m-1 bg-primary-background-light rounded-2xl`}>
            <UserCard user={offer.user} isBuyer />

            <BuyPriceInfo
              selectedCurrency={
                data?.tradeRequest?.currency || selectedCurrency
              }
            />
            {isRequested && selectedPaymentData ? (
              <PaidVia paymentMethod={selectedPaymentData.type} />
            ) : (
              <PaymentMethodSelector
                meansOfPayment={offer.meansOfPayment}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                selectedPaymentData={selectedPaymentData}
                setSelectedPaymentData={setSelectedPaymentData}
                selectedMethodInfo={undefined}
              />
            )}
            {isRequested && (
              <>
                <View style={tw`items-center justify-center z-99`}>
                  <UndoTradeRequestButton
                    offerId={offer.id}
                    requestingOfferId={requestingOfferId}
                    interrupTradeRequest={onInterruptTradeRequest}
                    setShowMatchedCard={setShowMatchedCard}
                  />
                </View>
                <View
                  style={tw`absolute top-0 left-0 w-full h-full opacity-75 rounded-xl`}
                  pointerEvents="none"
                >
                  <PeachyGradient />
                </View>
              </>
            )}
          </View>
        </View>
      </PeachScrollView>
      {!data?.tradeRequest && (
        <RequestTradeAction
          selectedPaymentData={selectedPaymentData}
          instantTradeCriteria={offer.instantTradeCriteria}
          isRequested={isRequested}
          onTradePress={onTradePress}
        />
      )}
    </View>
  );
}

function RequestTradeAction({
  selectedPaymentData,
  instantTradeCriteria,
  isRequested,
  onTradePress,
}: {
  selectedPaymentData: PaymentData | undefined;
  instantTradeCriteria: InstantTradeCriteria | null;
  isRequested: boolean;
  onTradePress: () => void;
}) {
  const { user } = useSelfUser();
  if (user === undefined) return null;

  const canInstantTrade =
    instantTradeCriteria && canUserInstantTrade(user, instantTradeCriteria);

  if (canInstantTrade) {
    return <ConfirmSlider label1="instant trade" onConfirm={onTradePress} />;
  }

  if (isRequested) return <WaitingForSeller />;

  return (
    <Button disabled={selectedPaymentData === undefined} onPress={onTradePress}>
      request trade
    </Button>
  );
}

function BuyPriceInfo({ selectedCurrency }: { selectedCurrency: Currency }) {
  const { amount, premium, offerId, requestingOfferId } =
    useRoute<"buyOfferDetails">().params;
  const { data } = useTradeRequest(offerId, requestingOfferId);
  const { data: priceBook } = useMarketPrices();

  const amountInBTC = amount / SATSINBTC;

  const bitcoinPrice = priceBook?.[selectedCurrency] ?? 0;
  const displayPrice = data?.tradeRequest
    ? data.tradeRequest.fiatPrice
    : bitcoinPrice * (1 + premium / CENT) * amountInBTC;

  const premiumOfTradeRequest = data?.tradeRequest
    ? round(
        ((round(data.tradeRequest.fiatPrice / amountInBTC, 2) - bitcoinPrice) /
          bitcoinPrice) *
          CENT,
        2,
      )
    : 0;
  return (
    <PriceInfo
      selectedCurrency={selectedCurrency}
      satsAmount={amount}
      price={displayPrice}
      premium={data?.tradeRequest ? premiumOfTradeRequest : premium}
    />
  );
}

function WaitingForSeller() {
  return (
    <View style={tw`items-center self-center`}>
      <View style={tw`flex-row items-center justify-center`}>
        <PeachText style={tw`subtitle-1`}>Waiting for seller</PeachText>
        <AnimatedButtons />
      </View>
      <PeachText style={tw`text-center subtitle-2`}>
        You can match as many offers as you want! You will buy from the first
        seller that accepts your trade request.
      </PeachText>
    </View>
  );
}

const DOT_DELAY = 200;
const NUMBER_OF_DOTS = 3;
const inputRange = new Array(NUMBER_OF_DOTS + 1)
  .fill(0)
  .map((_, i) => i / NUMBER_OF_DOTS);
function AnimatedButtons() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: DOT_DELAY * NUMBER_OF_DOTS,
          useNativeDriver: true,
        }),
        Animated.delay(DOT_DELAY),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const dots = Array.from({ length: NUMBER_OF_DOTS }, (_, index) => (
    <Animated.View
      key={index}
      style={{
        opacity: opacity.interpolate({
          inputRange,
          outputRange: Array.from({ length: NUMBER_OF_DOTS + 1 }, (_e, i) =>
            i > index ? 1 : 0,
          ),
        }),
      }}
    >
      <PeachText style={tw`subtitle-1`}>.</PeachText>
    </Animated.View>
  ));

  return <View style={tw`flex-row items-center justify-center`}>{dots}</View>;
}
