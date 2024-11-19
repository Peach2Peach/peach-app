import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { Match as MatchType } from "../../../peach-api/src/@types/match";
import { GradientBorder } from "../../components/GradientBorder";
import { Header } from "../../components/Header";
import { PeachyGradient } from "../../components/PeachyGradient";
import { ProfileInfo } from "../../components/ProfileInfo";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import {
  ConfirmSlider,
  UnlockedSlider,
} from "../../components/inputs/confirmSlider/ConfirmSlider";
import { UnmatchButton } from "../../components/matches/buttons/UnmatchButton";
import { options } from "../../components/matches/buttons/options";
import { EscrowLink } from "../../components/matches/components/EscrowLink";
import { PaymentMethodSelector } from "../../components/matches/components/PaymentMethodSelector";
import { PriceInfo } from "../../components/matches/components/PriceInfo";
import { useInterruptibleFunction } from "../../components/matches/hooks/useInterruptibleFunction";
import { useMatchOffer } from "../../components/matches/hooks/useMatchOffer";
import { getMatchPrice } from "../../components/matches/utils/getMatchPrice";
import { PeachText } from "../../components/text/PeachText";
import { HorizontalLine } from "../../components/ui/HorizontalLine";
import { CENT, SATSINBTC } from "../../constants";
import { useFeeEstimate } from "../../hooks/query/useFeeEstimate";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useThemeStore } from "../../store/theme";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { isLimitReached } from "../../utils/match/isLimitReached";
import { round } from "../../utils/math/round";
import { keys } from "../../utils/object/keys";
import { isBuyOffer } from "../../utils/offer/isBuyOffer";
import { getPaymentMethods } from "../../utils/paymentMethod/getPaymentMethods";
import { paymentMethodAllowedForCurrency } from "../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { peachAPI } from "../../utils/peachAPI";
import { LoadingScreen } from "../loading/LoadingScreen";
import { matchesKeys } from "../search/hooks/useOfferMatches";

export function MatchDetails() {
  const { matchId, offerId } = useRoute<"matchDetails">().params;

  const { data: match } = useMatchDetails({ offerId, matchId });
  const { offer } = useOfferDetail(offerId);

  const navigation = useStackNavigation();
  if (offer?.contractId) {
    navigation.reset({
      index: 1,
      routes: [
        {
          name: "homeScreen",
          params: { screen: "yourTrades", params: { tab: "yourTrades.buy" } },
        },
        { name: "contract", params: { contractId: offer.contractId } },
      ],
    });
  }

  if (!offer || !isBuyOffer(offer) || !match || offer.contractId)
    return <LoadingScreen />;
  return (
    <Screen showTradingLimit header={<MatchDetailsHeader />}>
      <Match match={match} offer={offer} />
    </Screen>
  );
}

function MatchDetailsHeader() {
  return <Header title={i18n("matchDetails.title")} />;
}

function useMatchDetails({
  offerId,
  matchId,
}: {
  offerId: string;
  matchId: string;
}) {
  const queryData = useQuery({
    queryKey: matchesKeys.matchDetail(offerId, matchId),
    queryFn: getMatchDetails,
    refetchInterval: 10000,
  });

  return queryData;
}

async function getMatchDetails({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof matchesKeys.matchDetail>>) {
  const [, offerId, matchId] = queryKey;
  const { result, error } = await peachAPI.private.offer.getMatch({
    offerId,
    matchId,
  });
  if (error || !result) throw new Error(error?.error || "Match not found");
  return result;
}

const MATCH_DELAY = 5000;
function Match({ match, offer }: { match: MatchType; offer: BuyOffer }) {
  const { mutate } = useMatchOffer(offer, match);
  const { meansOfPayment } = match;
  const { isDarkMode } = useThemeStore();

  const availableCurrencies = keys(meansOfPayment);
  const allPaymentMethods = getPaymentMethods(meansOfPayment);
  const [selectedCurrency, setSelectedCurrency] = useState(
    availableCurrencies[0],
  );

  const allMethodsForCurrency = allPaymentMethods.filter((p) =>
    paymentMethodAllowedForCurrency(p, selectedCurrency),
  );
  const paymentData = usePaymentDataStore((state) =>
    state.getPaymentDataArray(),
  );
  const dataForCurrency = paymentData.filter((d) =>
    allMethodsForCurrency.includes(d.type),
  );
  const defaultData =
    dataForCurrency.length === 1 ? dataForCurrency[0] : undefined;
  const [selectedPaymentData, setSelectedPaymentData] = useState(defaultData);

  const [showMatchedCard, setShowMatchedCard] = useState(match.matched);
  const isMatched = match.matched || showMatchedCard;
  const { maxMiningFeeRate } = useMaxMiningFee(match.amount);

  const matchOffer = () =>
    mutate(
      { selectedCurrency, paymentData: selectedPaymentData, maxMiningFeeRate },
      { onError: () => setShowMatchedCard(false) },
    );
  const { interruptibleFn: matchFunction, interrupt: interruptMatchFunction } =
    useInterruptibleFunction(() => {
      matchOffer();
    }, MATCH_DELAY);
  const onInterruptMatch = () => {
    interruptMatchFunction();
    setShowMatchedCard(false);
  };

  const onMatchPress = () => {
    setShowMatchedCard(true);
    matchFunction();
  };

  const [showPaymentMethodPulse, setShowPaymentMethodPulse] = useState(false);

  const tradingLimitReached = isLimitReached(
    match.unavailable.exceedsLimit || [],
    selectedPaymentData?.type,
  );

  const currentOptionName = useMemo(
    () =>
      isMatched
        ? "offerMatched"
        : tradingLimitReached
          ? "tradingLimitReached"
          : !selectedPaymentData
            ? "missingSelection"
            : "matchOffer",
    [isMatched, selectedPaymentData, tradingLimitReached],
  );
  return (
    <>
      <View style={tw`justify-center flex-1`}>
        <GradientBorder
          gradientBorderWidth={4}
          showBorder={isMatched}
          style={[
            tw`overflow-hidden rounded-2xl`,
            options[currentOptionName].backgroundColor,
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View
            style={[
              tw`rounded-xl`,
              isDarkMode
                ? tw`bg-backgroundMain-dark`
                : tw`bg-primary-background-light-color`,
            ]}
          >
            <View style={tw`gap-2 p-4 md:gap-4`}>
              <ProfileInfo user={match.user} isOnMatchCard />

              <HorizontalLine />

              <BuyerPriceInfo
                match={match}
                selectedCurrency={match.selectedCurrency || selectedCurrency}
                selectedPaymentMethod={
                  match.selectedPaymentMethod ||
                  selectedPaymentData?.type ||
                  allMethodsForCurrency[0]
                }
              />

              <HorizontalLine />

              <PaymentMethodSelector
                match={match}
                disabled={currentOptionName === "tradingLimitReached"}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                selectedPaymentData={selectedPaymentData}
                setSelectedPaymentData={setSelectedPaymentData}
                showPaymentMethodPulse={showPaymentMethodPulse}
              />

              <HorizontalLine />

              <EscrowLink address={match.escrow || ""} />
            </View>
            {isMatched && (
              <>
                <View
                  style={tw`absolute top-0 left-0 w-full h-full overflow-hidden opacity-75 rounded-t-xl`}
                  pointerEvents="none"
                >
                  <PeachyGradient />
                </View>
                <View
                  style={tw`absolute top-0 left-0 items-center justify-center w-full h-full`}
                  pointerEvents="box-none"
                >
                  <UnmatchButton
                    {...{ match, offer }}
                    interruptMatching={onInterruptMatch}
                    setShowMatchedCard={setShowMatchedCard}
                  />
                </View>
              </>
            )}
          </View>
        </GradientBorder>
      </View>
      {match.instantTrade ? (
        <InstantTradeSlider
          matchOffer={matchOffer}
          optionName={currentOptionName}
        />
      ) : (
        <MatchOfferButton
          matchOffer={onMatchPress}
          optionName={currentOptionName}
          setShowPaymentMethodPulse={setShowPaymentMethodPulse}
        />
      )}
    </>
  );
}

type Props = {
  matchOffer: () => void;
  optionName: keyof typeof options;
  setShowPaymentMethodPulse: (showPulse: boolean) => void;
};

function InstantTradeSlider({
  matchOffer,
  optionName,
}: {
  matchOffer: () => void;
  optionName: keyof typeof options;
}) {
  const label =
    optionName === "missingSelection"
      ? i18n("matchDetails.action.missingSelection")
      : optionName === "tradingLimitReached"
        ? i18n("matchDetails.action.tradingLimitReached")
        : i18n("matchDetails.action.instantTrade");

  const [showUnlockedSlider, setShowUnlockedSlider] = useState(false);

  const onConfirm = () => {
    setShowUnlockedSlider(true);
    matchOffer();
  };

  if (optionName === "offerMatched" && showUnlockedSlider)
    return <UnlockedSlider label={label} />;

  return (
    <ConfirmSlider
      label1={label}
      onConfirm={onConfirm}
      enabled={optionName === "matchOffer"}
    />
  );
}

function MatchOfferButton({
  matchOffer,
  optionName,
  setShowPaymentMethodPulse,
}: Props) {
  const onPress = () => {
    if (optionName === "matchOffer") {
      matchOffer();
    } else if (optionName === "missingSelection") {
      setShowPaymentMethodPulse(true);
    }
  };

  if (optionName === "offerMatched") return <WaitingForSeller />;

  return (
    <Button
      style={[
        tw`flex-row items-center self-center justify-center py-2 gap-10px`,
        tw`bg-primary-main`,
        optionName === "missingSelection" && tw`bg-primary-mild-1`,
        optionName === "tradingLimitReached" && tw`bg-black-50`,
      ]}
      onPress={onPress}
    >
      {i18n(
        optionName === "tradingLimitReached"
          ? "matchDetails.action.tradingLimitReached"
          : "matchDetails.action.requestTrade",
      )}
    </Button>
  );
}

function WaitingForSeller() {
  return (
    <View style={tw`items-center self-center`}>
      <PeachText style={tw`text-primary-main subtitle-1`}>
        {i18n("match.tradeRequested")}
      </PeachText>
      <View style={tw`flex-row items-center justify-center`}>
        <PeachText style={tw`text-primary-main subtitle-1`}>
          {i18n("match.waitingForSeller")}
        </PeachText>
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
      <PeachText style={tw`text-primary-main subtitle-1`}>.</PeachText>
    </Animated.View>
  ));

  return <View style={tw`flex-row items-center justify-center`}>{dots}</View>;
}

type PriceInfoProps = {
  match: Match;
  selectedCurrency: Currency;
  selectedPaymentMethod: PaymentMethod;
};

function BuyerPriceInfo({
  match,
  selectedCurrency,
  selectedPaymentMethod,
}: PriceInfoProps) {
  const { data: priceBook, isSuccess } = useMarketPrices();

  const amountInBTC = match.amount / SATSINBTC;
  const displayPrice = getMatchPrice(
    match,
    selectedPaymentMethod,
    selectedCurrency,
  );

  const bitcoinPrice =
    priceBook?.[selectedCurrency] ?? amountInBTC / displayPrice;

  const marketPrice = amountInBTC * bitcoinPrice;

  const premium = match.matched
    ? isSuccess
      ? round((displayPrice / marketPrice - 1) * CENT, 2)
      : 0
    : match.premium;

  return (
    <PriceInfo
      amount={match.amount}
      price={displayPrice}
      currency={selectedCurrency}
      premium={premium}
      miningFeeWarning={<MiningFeeWarning amount={match.amount} />}
    />
  );
}

const ESCROW_RELEASE_SIZE = 173;
const FEE_WARNING_THRESHOLD = 0.1;
function useMaxMiningFee(amount: number) {
  const { estimatedFees } = useFeeEstimate();
  const { user } = useSelfUser();
  const feeRate =
    user?.isBatchingEnabled === false
      ? user?.feeRate || "halfHourFee"
      : "halfHourFee";
  const feeRateAmount =
    typeof feeRate === "number" ? feeRate : estimatedFees[feeRate];
  const currentTotalFee = feeRateAmount * ESCROW_RELEASE_SIZE;

  const currentFeePercentage = round(currentTotalFee / amount, 2);
  const maxMiningFeeRate =
    currentFeePercentage > FEE_WARNING_THRESHOLD ? feeRateAmount : undefined;

  return { currentFeePercentage, maxMiningFeeRate };
}

function MiningFeeWarning({ amount }: { amount: number }) {
  const { currentFeePercentage, maxMiningFeeRate } = useMaxMiningFee(amount);
  if (maxMiningFeeRate === undefined) return null;
  return (
    <PeachText style={tw`text-center subtitle-1 text-error-main`}>
      {i18n(
        "match.feeWarning",
        String(Math.round(currentFeePercentage * CENT)),
      )}
    </PeachText>
  );
}
