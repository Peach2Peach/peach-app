import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { useShallow } from "zustand/shallow";
import { Match as MatchType } from "../../../peach-api/src/@types/match";
import { PeachyBackground } from "../../components/PeachyBackground";
import { PeachyGradient } from "../../components/PeachyGradient";
import { Screen } from "../../components/Screen";
import { NewBubble } from "../../components/bubble/Bubble";
import { Button } from "../../components/buttons/Button";
import {
  ConfirmSlider,
  UnlockedSlider,
} from "../../components/inputs/confirmSlider/ConfirmSlider";
import { UnmatchButton } from "../../components/matches/buttons/UnmatchButton";
import { PaymentMethodSelector } from "../../components/matches/components/PaymentMethodSelector";
import { useInterruptibleFunction } from "../../components/matches/hooks/useInterruptibleFunction";
import { useMatchOffer } from "../../components/matches/hooks/useMatchOffer";
import { PeachText } from "../../components/text/PeachText";
import { useFeeEstimate } from "../../hooks/query/useFeeEstimate";
import { useOfferDetail } from "../../hooks/query/useOfferDetail";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { PAYMENTCATEGORIES } from "../../paymentMethods";
import { useThemeStore } from "../../store/theme";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { round } from "../../utils/math/round";
import { keys } from "../../utils/object/keys";
import { isBuyOffer } from "../../utils/offer/isBuyOffer";
import { peachAPI } from "../../utils/peachAPI";
import { LoadingScreen } from "../loading/LoadingScreen";
import { matchesKeys } from "../search/hooks/useOfferMatches";
import { BuyerPriceInfo } from "./BuyerPriceInfo";
import { FundingInfo } from "./FundingInfo";
import { MiningFeeWarning } from "./MiningFeeWarning";
import { UserCard } from "./UserCard";

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
    <Screen header="sell offer details">
      <Match match={match} offer={offer} />
    </Screen>
  );
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

const ANONYMOUS_PAYMENTCATEGORIES = PAYMENTCATEGORIES.cash.concat(
  PAYMENTCATEGORIES.giftCard,
);

const isLimitReached = (
  exceedsLimit: (keyof TradingLimit)[],
  selectedPaymentMethod?: PaymentMethod,
) =>
  exceedsLimit.includes("daily") ||
  exceedsLimit.includes("yearly") ||
  (exceedsLimit.includes("monthlyAnonymous") &&
    selectedPaymentMethod &&
    ANONYMOUS_PAYMENTCATEGORIES.includes(selectedPaymentMethod));

const MATCH_DELAY = 5000;
function Match({ match, offer }: { match: MatchType; offer: BuyOffer }) {
  const { mutate } = useMatchOffer(offer, match);
  const { meansOfPayment } = match;
  const { isDarkMode } = useThemeStore();

  const [selectedCurrency, setSelectedCurrency] = useState(
    match.selectedCurrency || keys(meansOfPayment)[0],
  );

  const allMethodsForCurrency = meansOfPayment[selectedCurrency];
  const paymentData = usePaymentDataStore(
    useShallow((state) => Object.values(state.paymentData)),
  );
  const dataForCurrency = paymentData.filter((d) =>
    allMethodsForCurrency?.includes(d.type),
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
      <View style={tw`gap-8 grow`}>
        {match.escrow && (
          <FundingInfo escrow={match.escrow} fundingStatus={"FUNDED"} />
        )}
        <View style={tw`grow`}>
          <View style={tw`overflow-hidden rounded-2xl`}>
            {isMatched && <PeachyBackground />}
            <View
              style={[
                tw`gap-8 m-1 bg-primary-background-light rounded-2xl`,
                isDarkMode
                  ? tw`bg-backgroundMain-dark`
                  : tw`bg-primary-background-light`,
              ]}
            >
              <UserCard user={match.user} />

              <MiningFeeWarning amount={match.amount} />

              <BuyerPriceInfo
                match={match}
                selectedCurrency={selectedCurrency}
                selectedPaymentMethod={
                  match.selectedPaymentMethod ||
                  selectedPaymentData?.type ||
                  allMethodsForCurrency?.[0]
                }
              />

              {isMatched ? (
                <View style={tw`flex-row items-center justify-between px-3`}>
                  <PeachText>paid via</PeachText>
                  <NewBubble color="black" ghost>
                    {match.selectedPaymentMethod || selectedPaymentData?.type}
                  </NewBubble>
                </View>
              ) : (
                <PaymentMethodSelector
                  meansOfPayment={meansOfPayment}
                  selectedCurrency={selectedCurrency}
                  setSelectedCurrency={setSelectedCurrency}
                  selectedPaymentData={selectedPaymentData}
                  setSelectedPaymentData={setSelectedPaymentData}
                  selectedMethodInfo={undefined}
                />
              )}
              {isMatched && (
                <>
                  <View style={tw`items-center justify-center z-99`}>
                    <UnmatchButton
                      {...{ match, offer }}
                      interruptMatching={onInterruptMatch}
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
        </View>
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
        />
      )}
    </>
  );
}

const options = {
  missingSelection: {
    text: "search.matchButton.matchOffer",
    iconId: "plusSquare",
  },
  tradingLimitReached: {
    text: "search.matchButton.tradingLimitReached",
    iconId: "pauseCircle",
    backgroundColor: tw`bg-black-50`,
  },
  matchOffer: {
    text: "search.matchButton.matchOffer",
    iconId: "plusSquare",
    backgroundColor: tw`bg-primary-main`,
  },
  acceptMatch: {
    text: "search.matchButton.acceptMatch",
    iconId: "checkSquare",
    backgroundColor: tw`bg-primary-main`,
  },
  offerMatched: {
    text: "search.matchButton.offerMatched",
    iconId: "checkSquare",
    backgroundColor: tw`bg-gradient-red`,
  },
} as const;

type Props = {
  matchOffer: () => void;
  optionName: keyof typeof options;
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

function MatchOfferButton({ matchOffer, optionName }: Props) {
  const onPress = () => {
    if (optionName === "matchOffer") {
      matchOffer();
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

const ESCROW_RELEASE_SIZE = 173;
const FEE_WARNING_THRESHOLD = 0.1;
export function useMaxMiningFee(amount: number) {
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
