import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { shallow } from "zustand/shallow";
import {
  BuyOffer69,
  BuyOffer69TradeRequest,
  SellOffer69TradeRequest,
} from "../../../peach-api/src/@types/offer";
import { GradientBorder } from "../../components/GradientBorder";
import { Icon } from "../../components/Icon";
import { PeachyGradient } from "../../components/PeachyGradient";
import { ProfileInfo } from "../../components/ProfileInfo";
import { NewBubble } from "../../components/bubble/Bubble";
import { Button } from "../../components/buttons/Button";
import {
  ConfirmSlider,
  UnlockedSlider,
} from "../../components/inputs/confirmSlider/ConfirmSlider";
import { UndoButton } from "../../components/matches/buttons/UndoButton";
import { options } from "../../components/matches/buttons/options";
import { PaymentMethodSelector } from "../../components/matches/components/PaymentMethodSelector";
import { PriceInfo } from "../../components/matches/components/PriceInfo";
import { useHandleError } from "../../components/matches/utils/useHandleError";
import { useClosePopup, useSetPopup } from "../../components/popup/GlobalPopup";
import { PopupAction } from "../../components/popup/PopupAction";
import { ClosePopupAction } from "../../components/popup/actions/ClosePopupAction";
import { PeachText } from "../../components/text/PeachText";
import { useSetToast } from "../../components/toast/Toast";
import { HorizontalLine } from "../../components/ui/HorizontalLine";
import { CENT, SATSINBTC } from "../../constants";
import { useFeeEstimate } from "../../hooks/query/useFeeEstimate";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useMeetupEvents } from "../../hooks/query/useMeetupEvents";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { AppPopup } from "../../popups/AppPopup";
import { WarningPopup } from "../../popups/WarningPopup";
import { useThemeStore } from "../../store/theme";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { round } from "../../utils/math/round";
import { keys } from "../../utils/object/keys";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { peachWallet } from "../../utils/wallet/setWallet";

const TRADE_REQUEST_DELAY = 5000;
export function ExpressFlowTradeRequestToOffer({
  offer,
  onTradeRequestDisappearingFunction,
  originRoute,
  canInstantTradeWithOffer,
  offerTradeRequestPerformedBySelfUser,
  removeThisTradeRequestFunction,
  performThisTradeRequestFunction,
  performThisTradeRequestInstantTradeFunction,
  goToChatFunction,
  selfUser,
  offerOwnerUser,
}: {
  offer: BuyOffer69 | SellOffer;
  onTradeRequestDisappearingFunction: Function;
  originRoute: keyof RootStackParamList;
  canInstantTradeWithOffer: boolean;
  offerTradeRequestPerformedBySelfUser:
    | null
    | BuyOffer69TradeRequest
    | SellOffer69TradeRequest;
  removeThisTradeRequestFunction: () => Promise<void>;
  performThisTradeRequestFunction: ({
    maxMiningFeeRate,
    selectedPaymentData,
    selectedCurrency,
    handleError,
  }: {
    maxMiningFeeRate?: number;
    selectedPaymentData: PaymentData;
    selectedCurrency: Currency;
    handleError: Function;
  }) => Promise<boolean>;
  performThisTradeRequestInstantTradeFunction: ({
    maxMiningFeeRate,
    selectedPaymentData,
    selectedCurrency,
    handleError,
  }: {
    maxMiningFeeRate?: number;
    selectedPaymentData: PaymentData;
    selectedCurrency: Currency;
    handleError: Function;
  }) => Promise<void>;
  goToChatFunction: () => Promise<void>;
  selfUser: User;
  offerOwnerUser: PublicUser;
}) {
  const handleError = useHandleError();
  const setToast = useSetToast();
  const [selectedCurrency, setSelectedCurrency] = useState(
    keys(offer.meansOfPayment)[0],
  );

  const allMethodsForCurrency = offer.meansOfPayment[selectedCurrency];
  const paymentData = usePaymentDataStore(
    (state) => Object.values(state.paymentData),
    shallow,
  );
  const dataForCurrency = paymentData.filter((d) =>
    allMethodsForCurrency?.includes(d.type),
  );
  const defaultData =
    dataForCurrency.length === 1 ? dataForCurrency[0] : undefined;
  const [selectedPaymentData, setSelectedPaymentData] = useState(defaultData);

  const [showMatchedCard, setShowMatchedCard] = useState(
    Boolean(offerTradeRequestPerformedBySelfUser),
  );
  const [hasHadTradeRequest, setHasHadTradeRequest] = useState(
    Boolean(offerTradeRequestPerformedBySelfUser),
  );

  useEffect(() => {
    if (offerTradeRequestPerformedBySelfUser === null && hasHadTradeRequest) {
      setHasHadTradeRequest(false);
      setShowMatchedCard(false);
      onTradeRequestDisappearingFunction();
    } else if (offerTradeRequestPerformedBySelfUser && !hasHadTradeRequest) {
      setHasHadTradeRequest(true);
    }
  }, [offerTradeRequestPerformedBySelfUser]);

  const [hasPendingAction, setHasPendingAction] = useState(false);

  const isMatched = showMatchedCard;
  const amountSats =
    offer.amountSats !== undefined
      ? (offer as BuyOffer69).amountSats
      : (offer as SellOffer).amount;
  const { maxMiningFeeRate } = useMaxMiningFee(amountSats); //TODO: validate this

  const [showPaymentMethodPulse, setShowPaymentMethodPulse] = useState(false);

  const tradingLimitReached = false; // TODO: HANDLE LIMIT REACHED

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

  const { isDarkMode } = useThemeStore();

  const performThisTradeRequestFunctionArgsDefined = async () => {
    try {
      const success = await performThisTradeRequestFunction({
        maxMiningFeeRate: maxMiningFeeRate,
        selectedPaymentData: selectedPaymentData!,
        selectedCurrency,
        handleError,
      });
      if (!success) {
        setShowMatchedCard(false);
      } else {
        setToast({ msgKey: "TRADE_REQUEST_PERFORMED", color: "yellow" });
      }
    } catch (err) {
      console.log("error: ", err);
    }

    setHasPendingAction(false);
  };

  const performThisTradeRequestInstantTradeFunctionArgsDefined = () =>
    performThisTradeRequestInstantTradeFunction({
      maxMiningFeeRate: maxMiningFeeRate,
      selectedPaymentData: selectedPaymentData!,
      selectedCurrency,
      handleError,
    });

  const navigation = useStackNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", async (e) => {
      if (!hasPendingAction) return;

      e.preventDefault();

      try {
        await performThisTradeRequestFunctionArgsDefined();
      } catch (err) {
        console.log("Error: ", err);
      }

      navigation.dispatch(e.data.action);
    });

    return unsubscribe;
  }, [navigation, hasPendingAction]);

  const displayableChatMessages = offerTradeRequestPerformedBySelfUser
    ? offerTradeRequestPerformedBySelfUser.chatMessages.filter(
        (x) => x.seen === false && x.sender === "offerOwner",
      )
    : [];

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
              {offerOwnerUser !== undefined && (
                <ProfileInfo user={offerOwnerUser} isOnMatchCard />
              )}
              <HorizontalLine />

              <BuyerPriceInfo
                offer={offer}
                selectedCurrency={selectedCurrency}
              />

              <PaymentMethodSelector
                origin={originRoute}
                meansOfPayment={offer.meansOfPayment}
                disabled={currentOptionName === "tradingLimitReached"}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                selectedPaymentData={selectedPaymentData}
                setSelectedPaymentData={setSelectedPaymentData}
                showPaymentMethodPulse={showPaymentMethodPulse}
                selectedMethodInfo={
                  offerTradeRequestPerformedBySelfUser ? (
                    <SelectedMethodInfo
                      selectedCurrency={
                        offerTradeRequestPerformedBySelfUser.currency as Currency
                      }
                      selectedPaymentMethod={
                        offerTradeRequestPerformedBySelfUser.paymentMethod as PaymentMethod
                      }
                    />
                  ) : undefined
                }
              />
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
                    undoInTimeCallback={() => setShowMatchedCard(false)}
                    onTimerSuccess={performThisTradeRequestFunctionArgsDefined}
                    match={offerTradeRequestPerformedBySelfUser}
                    unmatchCallback={async () => {
                      await removeThisTradeRequestFunction();
                      setShowMatchedCard(false);
                    }}
                  />
                </View>
              </>
            )}
          </View>
        </GradientBorder>
      </View>
      {!offerTradeRequestPerformedBySelfUser &&
        !canInstantTradeWithOffer &&
        !isMatched && (
          <PerformTradeRequestButton
            selectedPaymentData={selectedPaymentData}
            selectedCurrency={selectedCurrency}
            selfUser={selfUser}
            offerOwnerUser={offerOwnerUser}
            proceedWithPerformingTradeRequest={() => {
              setShowMatchedCard(true);
              setHasPendingAction(true);
            }}
          />
        )}
      {!offerTradeRequestPerformedBySelfUser && canInstantTradeWithOffer && (
        <InstantTradeSlider
          sliderCallback={
            performThisTradeRequestInstantTradeFunctionArgsDefined
          }
          selectedPaymentData={selectedPaymentData}
          selectedCurrency={selectedCurrency}
          selfUser={selfUser}
          offerOwnerUser={offerOwnerUser}
        />
      )}
      {offerTradeRequestPerformedBySelfUser && selfUser && (
        <>
          <Button
            style={[
              tw`flex-row items-center self-center justify-center py-2 gap-10px`,
              tw`bg-primary-main`,
            ]}
            onPress={goToChatFunction}
          >
            {"Chat"}
            {displayableChatMessages.length > 0 && (
              <View style={[tw`items-center justify-center w-7 h-7`]}>
                <Icon
                  id={"messageFull"}
                  size={24}
                  color={tw.color("primary-background-light-color")}
                />
                <PeachText style={tw`absolute text-center font-baloo-bold`}>
                  {displayableChatMessages.length}
                </PeachText>
              </View>
            )}
          </Button>
          <WaitingForSeller />
        </>
      )}
    </>
  );
}
const InstantTradeSlider = ({
  sliderCallback,
  selectedPaymentData,
  selectedCurrency,
  selfUser,
  offerOwnerUser,
}: {
  sliderCallback: () => void;
  selectedPaymentData?: PaymentData;
  selectedCurrency?: Currency;
  selfUser?: User;
  offerOwnerUser?: PublicUser;
}) => {
  const label = i18n("matchDetails.action.instantTrade");

  const [showUnlockedSlider, setShowUnlockedSlider] = useState(false);

  const onConfirm = () => {
    setShowUnlockedSlider(true);
    sliderCallback();
  };

  if (showUnlockedSlider) return <UnlockedSlider label={label} />;

  return (
    <ConfirmSlider
      label1={label}
      onConfirm={onConfirm}
      enabled={
        Boolean(selectedPaymentData) &&
        Boolean(selectedCurrency) &&
        Boolean(peachWallet) &&
        Boolean(selfUser) &&
        Boolean(offerOwnerUser)
      }
    />
  );
};
function SelectedMethodInfo({
  selectedCurrency,
  selectedPaymentMethod,
}: {
  selectedCurrency: Currency | undefined;
  selectedPaymentMethod: PaymentMethod | undefined;
}) {
  const { data: meetupEvents } = useMeetupEvents();
  const getPaymentMethodName = (paymentMethod: PaymentMethod) => {
    if (isCashTrade(paymentMethod)) {
      const eventId = paymentMethod.replace("cash.", "");
      const meetupEvent = meetupEvents?.find(({ id }) => id === eventId);
      return meetupEvent?.shortName ?? eventId;
    }
    return i18n(`paymentMethod.${paymentMethod}`);
  };
  if (!selectedCurrency || !selectedPaymentMethod) return null;

  return (
    <>
      <PeachText style={tw`text-center button-large`}>
        {selectedCurrency}
      </PeachText>
      <View
        style={[tw`w-1/4 self-center h-0.5 -mt-3 bg-black-100 rounded-1px`]}
      />
      <View style={tw`items-center`}>
        <NewBubble color="orange" iconId="checkSquare">
          {getPaymentMethodName(selectedPaymentMethod)}
        </NewBubble>
      </View>
    </>
  );
}

function PerformTradeRequestButton({
  selectedPaymentData,
  selectedCurrency,
  selfUser,
  offerOwnerUser,
  proceedWithPerformingTradeRequest,
}: {
  maxMiningFeeRate?: number;
  selectedPaymentData?: PaymentData;
  selectedCurrency?: Currency;
  selfUser?: User;
  offerOwnerUser?: PublicUser;
  proceedWithPerformingTradeRequest: () => void;
}) {
  return (
    <Button
      style={[
        tw`flex-row items-center self-center justify-center py-2 gap-10px`,
        tw`bg-primary-main`,
      ]}
      onPress={proceedWithPerformingTradeRequest}
      disabled={
        !selectedPaymentData ||
        !selectedCurrency ||
        !peachWallet ||
        !selfUser ||
        !offerOwnerUser
      }
    >
      {i18n("matchDetails.action.requestTrade")}
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
          {i18n("match.waitingForTrader")}
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
  offer: BuyOffer69 | SellOffer;
  selectedCurrency: Currency;
  // selectedPaymentMethod: PaymentMethod | undefined;
};

function BuyerPriceInfo({ offer, selectedCurrency }: PriceInfoProps) {
  const amountSats =
    offer.amount !== undefined
      ? (offer as SellOffer).amount
      : (offer as BuyOffer69).amountSats;
  const { data: priceBook } = useMarketPrices();
  const premium = offer.premium; // TODO: handle match
  const conversionPriceOfCurrency = priceBook?.[selectedCurrency];
  if (!conversionPriceOfCurrency)
    throw Error("invalid price conversion for currency");
  const price = (conversionPriceOfCurrency * amountSats) / SATSINBTC;
  return (
    <PriceInfo
      amount={amountSats} // TODO: handle match
      price={price * ((100 + premium) / 100)}
      currency={selectedCurrency}
      premium={premium}
      miningFeeWarning={<MiningFeeWarning amount={amountSats} />}
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

export const UnmatchButton = ({
  undoInTimeCallback,
  onTimerSuccess,
  unmatchCallback,
  match,
}: {
  undoInTimeCallback: () => void;
  onTimerSuccess: () => Promise<void>;
  unmatchCallback: () => Promise<void>;
  match: BuyOffer69TradeRequest | SellOffer69TradeRequest | undefined;
}) => {
  const setPopup = useSetPopup();
  const closePopup = useClosePopup();

  const [showUnmatch, setShowUnmatch] = useState(Boolean(match));

  const hoursPassedSinceTradeRequestPerformed = match
    ? Math.floor((Date.now() - match.creationDate.getTime()) / (1000 * 60 * 60))
    : 0;

  const hoursNeededUntilTradeReqIsPenaltyFree = Math.max(
    12 - hoursPassedSinceTradeRequestPerformed,
    0,
  );

  const showUnmatchPopup = useCallback(() => {
    setPopup(
      <WarningPopup
        title={i18n("search.popups.unmatch.title")}
        content={
          hoursNeededUntilTradeReqIsPenaltyFree > 0
            ? i18n(
                "search.popups.unmatch.text",
                String(hoursNeededUntilTradeReqIsPenaltyFree),
              )
            : i18n("search.popups.unmatchNoPenalty.text")
        }
        actions={
          <>
            <PopupAction
              label={i18n("search.popups.unmatch.confirm")}
              iconId="minusCircle"
              textStyle={tw`text-black-100`}
              onPress={() => {
                setPopup(
                  <WarningPopup
                    title={i18n("search.popups.unmatched")}
                    actions={
                      <ClosePopupAction
                        style={tw`justify-center`}
                        textStyle={tw`text-black-100`}
                      />
                    }
                  />,
                );
                unmatchCallback();
              }}
            />
            <PopupAction
              label={i18n("search.popups.unmatch.neverMind")}
              textStyle={tw`text-black-100`}
              iconId="xSquare"
              onPress={closePopup}
              reverseOrder
            />
          </>
        }
      />,
    );
  }, [closePopup, setPopup]);

  const onUndoPress = () => {
    undoInTimeCallback();
    setPopup(<AppPopup id="matchUndone" />);
  };

  return showUnmatch ? (
    <Button
      onPress={showUnmatchPopup}
      iconId="minusCircle"
      textColor={tw.color("error-main")}
      style={tw`bg-primary-background-light-color`}
    >
      {i18n("search.unmatch")}
    </Button>
  ) : (
    <UndoButton
      onPress={onUndoPress}
      onTimerFinished={() => {
        setShowUnmatch(true);
        onTimerSuccess();
      }}
    />
  );
};
