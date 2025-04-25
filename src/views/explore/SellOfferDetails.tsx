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
import { useTradeRequestSellOffer } from "../../components/offer/useTradeRequestOffer";
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
import { FundingInfo } from "./FundingInfo";
import { MiningFeeWarning } from "./MiningFeeWarning";
import { PaidVia } from "./PaidVia";
import { UserCard } from "./UserCard";
import { canUserInstantTrade } from "./canUserInstantTrade";
import { useOffer } from "./useOffer";
import { useTradeRequest } from "./useTradeRequest";

export function SellOfferDetails() {
  const { offerId, requestingOfferId } = useRoute<"sellOfferDetails">().params;
  const { data: offer, isLoading } = useOffer(offerId);

  return (
    <Screen header={`offer ${offerIdToHex(offerId)}`}>
      {isLoading || !offer ? (
        <ActivityIndicator size={"large"} />
      ) : (
        <SellOfferDetailsComponent
          offer={offer}
          requestingOfferId={requestingOfferId}
        />
      )}
    </Screen>
  );
}

function SellOfferDetailsComponent({
  offer,
  requestingOfferId,
}: {
  offer: GetOfferResponseBody;
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
  const { data } = useTradeRequest(offer.id, requestingOfferId);

  const [showMatchedCard, setShowMatchedCard] = useState(!!data?.tradeRequest);
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
  const { mutate } = useTradeRequestSellOffer({
    selectedCurrency,
    selectedPaymentData,
    offer,
    requestingOfferId,
  });
  const MATCH_DELAY = 5000;
  const tradeOffer = (instant: boolean) =>
    mutate(instant, { onError: () => setShowMatchedCard(false) });
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
        {offer.escrow && (
          <FundingInfo
            escrow={offer.escrow}
            fundingStatus={offer.fundingStatus ?? "NULL"}
          />
        )}
        <View style={tw`overflow-hidden rounded-2xl`}>
          {isRequested && <PeachyBackground />}
          <View style={tw`gap-8 m-1 rounded-2xl bg-primary-background-light`}>
            <UserCard user={offer.user} />
            {/** @ts-ignore */}
            <MiningFeeWarning amount={offer.amount} />
            <SellPriceInfo offer={offer} selectedCurrency={selectedCurrency} />
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
          offer={offer}
          selectedPaymentData={selectedPaymentData}
          isRequested={isRequested}
          onTradePress={onTradePress}
        />
      )}
    </View>
  );
}

function SellPriceInfo({
  offer,
  selectedCurrency,
}: {
  offer: GetOfferResponseBody;
  selectedCurrency: Currency;
}) {
  const { data: priceBook, isSuccess } = useMarketPrices();

  const amountInBTC = Number(offer.amount) / SATSINBTC;
  const displayPrice = offer.prices?.[selectedCurrency] ?? 0;

  const bitcoinPrice =
    priceBook?.[selectedCurrency] ?? amountInBTC / displayPrice;
  const marketPrice = amountInBTC * bitcoinPrice;

  const premium = offer.premium
    ? isSuccess
      ? round((displayPrice / marketPrice - 1) * CENT, 2)
      : 0
    : offer.premium;

  return (
    <PriceInfo
      // @ts-ignore
      satsAmount={offer.amount}
      selectedCurrency={selectedCurrency}
      // @ts-ignore
      premium={premium}
      price={displayPrice}
    />
  );
}

function RequestTradeAction({
  offer,
  selectedPaymentData,
  isRequested,
  onTradePress,
}: {
  offer: GetOfferResponseBody;
  selectedPaymentData: PaymentData | undefined;
  isRequested: boolean;
  onTradePress: () => void;
}) {
  const { user } = useSelfUser();
  if (user === undefined) return null;

  const { instantTradeCriteria } = offer;
  const canInstantTrade =
    instantTradeCriteria && canUserInstantTrade(user, instantTradeCriteria);
  if (canInstantTrade) {
    return <ConfirmSlider label1="instant trade" onConfirm={onTradePress} />;
  }

  if (isRequested) return <WaitingForSeller />;

  return (
    <Button
      style={tw`self-center`}
      disabled={selectedPaymentData === undefined}
      onPress={onTradePress}
    >
      request trade
    </Button>
  );
}

function WaitingForSeller() {
  return (
    <View style={tw`items-center self-center`}>
      <View style={tw`flex-row items-center justify-center`}>
        <PeachText style={tw`subtitle-1`}>Waiting for seller</PeachText>
        <AnimatedButtons />
      </View>
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
