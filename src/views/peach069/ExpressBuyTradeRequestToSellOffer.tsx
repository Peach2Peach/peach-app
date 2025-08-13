import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { shallow } from "zustand/shallow";
import { Pricebook } from "../../../peach-api/src/@types/global";
import { GradientBorder } from "../../components/GradientBorder";
import { PeachyGradient } from "../../components/PeachyGradient";
import { ProfileInfo } from "../../components/ProfileInfo";
import { Screen } from "../../components/Screen";
import { NewBubble } from "../../components/bubble/Bubble";
import { Button } from "../../components/buttons/Button";
import {
  ConfirmSlider,
  UnlockedSlider,
} from "../../components/inputs/confirmSlider/ConfirmSlider";
import { options } from "../../components/matches/buttons/options";
import { PaymentMethodSelector } from "../../components/matches/components/PaymentMethodSelector";
import { PriceInfo } from "../../components/matches/components/PriceInfo";
import { useInterruptibleFunction } from "../../components/matches/hooks/useInterruptibleFunction";
import { PeachText } from "../../components/text/PeachText";
import { HorizontalLine } from "../../components/ui/HorizontalLine";
import { CENT, SATSINBTC } from "../../constants";
import { useCanInstantTradeWithSellOffer } from "../../hooks/query/peach069/useCanInstantTradeWithSellOffer";
import { useSellOfferDetail } from "../../hooks/query/peach069/useSellOffer";
import { useSellOfferTradeRequestBySelfUser } from "../../hooks/query/peach069/useSellOfferTradeRequestBySelfUser";
import { useUserDetails } from "../../hooks/query/peach069/useUser";
import { useFeeEstimate } from "../../hooks/query/useFeeEstimate";
import { useMarketPrices } from "../../hooks/query/useMarketPrices";
import { useMeetupEvents } from "../../hooks/query/useMeetupEvents";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { getHashedPaymentData } from "../../store/offerPreferenes/helpers/getHashedPaymentData";
import { useThemeStore } from "../../store/theme";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import tw from "../../styles/tailwind";
import { getMessageToSignForAddress } from "../../utils/account/getMessageToSignForAddress";
import { getRandom } from "../../utils/crypto/getRandom";
import i18n from "../../utils/i18n";
import { round } from "../../utils/math/round";
import { StackNavigation } from "../../utils/navigation/handlePushNotification";
import { keys } from "../../utils/object/keys";
import { offerIdToHex } from "../../utils/offer/offerIdToHex";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { encryptPaymentData } from "../../utils/paymentMethod/encryptPaymentData";
import { isCashTrade } from "../../utils/paymentMethod/isCashTrade";
import { peachAPI } from "../../utils/peachAPI";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
import { peachWallet } from "../../utils/wallet/setWallet";
import { decryptSymmetricKey } from "../contract/helpers/decryptSymmetricKey";
import { LoadingScreen } from "../loading/LoadingScreen";

export function ExpressBuyTradeRequestToSellOffer() {
  const { offerId } = useRoute<"expressBuyTradeRequest">().params;

  const { sellOffer, isLoading } = useSellOfferDetail(offerId);

  if (isLoading || !sellOffer) return <LoadingScreen />;
  return (
    <Screen showTradingLimit header={offerIdToHex(sellOffer.id)}>
      <TradeRequest sellOffer={sellOffer} />
    </Screen>
  );
}

const performInstantTrade = async ({
  selectedPaymentData,
  maxMiningFeeRate,
  selectedCurrency,
  sellOfferId,
  selfUser,
  sellOfferUser,
  navigation,
}: {
  maxMiningFeeRate?: number;
  selectedPaymentData?: PaymentData;
  selectedCurrency?: Currency;
  sellOfferId: string;
  selfUser?: User;
  sellOfferUser?: PublicUser;
  navigation: StackNavigation;
}): Promise<void> => {
  {
    if (!peachWallet) throw Error("Peach Wallet not ready");
    if (
      !maxMiningFeeRate ||
      !selectedPaymentData ||
      !selectedCurrency ||
      !peachWallet ||
      !selfUser ||
      !sellOfferUser
    )
      throw Error("values not ready");
    const { address: releaseAddress, index } = await peachWallet.getAddress();

    const message = getMessageToSignForAddress(selfUser.id, releaseAddress);

    const releaseAddressMessageSignature = peachWallet.signMessage(
      message,
      index,
    );

    const symmetricKey = (await getRandom(SYMMETRIC_KEY_BYTES)).toString("hex");
    const { encrypted, signature } = await signAndEncrypt(
      symmetricKey,
      [
        ...selfUser.pgpPublicKeys.map((pgp) => pgp.publicKey),
        ...sellOfferUser.pgpPublicKeys.map((pgp) => pgp.publicKey),
      ].join("\n"),
    );

    const decryptionResult = await decryptSymmetricKey(encrypted, signature, [
      ...selfUser.pgpPublicKeys,
      ...sellOfferUser.pgpPublicKeys,
    ]);
    if (!decryptionResult)
      throw Error("Couldnt decrypt the created symmetric key");
    const encryptedPaymentData = await encryptPaymentData(
      cleanPaymentData(selectedPaymentData),
      symmetricKey,
    );
    if (!encryptedPaymentData) throw Error("PAYMENTDATA_ENCRYPTION_FAILED");
    const hashedPaymentData = getHashedPaymentData([selectedPaymentData]);

    const instantTradeResp =
      await peachAPI.private.peach069.performInstantTradeWithSellOfferById({
        sellOfferId,
        paymentMethod: selectedPaymentData.type,
        currency: selectedCurrency,
        paymentDataHashed: hashedPaymentData,
        paymentDataEncrypted: encryptedPaymentData.encrypted,
        paymentDataSignature: encryptedPaymentData.signature,
        symmetricKeyEncrypted: encrypted,
        symmetricKeySignature: signature,
        maxMiningFeeRate: maxMiningFeeRate,
        releaseAddress,
        releaseAddressMessageSignature,
      });

    if (instantTradeResp.result?.id) {
      navigation.navigate("contract", {
        contractId: instantTradeResp.result?.id,
      });
    }
  }
};

const TRADE_REQUEST_DELAY = 5000;
function TradeRequest({ sellOffer }: { sellOffer: SellOffer }) {
  const { isDarkMode } = useThemeStore();
  const navigation = useStackNavigation();

  const { user: selfUser } = useSelfUser();
  const { data: sellOfferUser } = useUserDetails({ userId: sellOffer.user.id });

  const {
    data: sellOfferTradeRequestPerformedBySelfUser,
    refetch: sellOfferTradeRequestPerformedBySelfUserRefetch,
  } = useSellOfferTradeRequestBySelfUser({ sellOfferId: sellOffer.id });

  const { data: canInstantTradeWithSellOffer } =
    useCanInstantTradeWithSellOffer(sellOffer.id);

  const { data: priceBook } = useMarketPrices();

  const [selectedCurrency, setSelectedCurrency] = useState(
    keys(sellOffer.meansOfPayment)[0],
  );

  const allMethodsForCurrency = sellOffer.meansOfPayment[selectedCurrency];
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

  const [showMatchedCard, setShowMatchedCard] = useState(false);
  const isMatched = showMatchedCard;
  const { maxMiningFeeRate } = useMaxMiningFee(sellOffer.amount); //TODO: validate this

  const { interruptibleFn: matchFunction, interrupt: interruptMatchFunction } =
    useInterruptibleFunction(() => {
      //   matchOffer();
    }, TRADE_REQUEST_DELAY);
  const onInterruptMatch = () => {
    interruptMatchFunction();
    setShowMatchedCard(false);
  };

  const [showPaymentMethodPulse, setShowPaymentMethodPulse] = useState(false);

  //   const tradingLimitReached = isLimitReached(
  //     match.unavailable.exceedsLimit || [],
  //     selectedPaymentData?.type,
  //   );
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
              {sellOfferUser !== undefined && (
                <ProfileInfo user={sellOfferUser} isOnMatchCard />
              )}
              <HorizontalLine />
              {priceBook && (
                <SellerPriceInfo
                  sellOffer={sellOffer}
                  selectedCurrency={selectedCurrency}
                  priceBook={priceBook}
                />
              )}
              <PaymentMethodSelector
                origin="expressBuyTradeRequest"
                meansOfPayment={sellOffer.meansOfPayment}
                disabled={currentOptionName === "tradingLimitReached"}
                selectedCurrency={selectedCurrency}
                setSelectedCurrency={setSelectedCurrency}
                selectedPaymentData={selectedPaymentData}
                setSelectedPaymentData={setSelectedPaymentData}
                showPaymentMethodPulse={showPaymentMethodPulse}
                selectedMethodInfo={
                  // match.matched ? (
                  //   <SelectedMethodInfo
                  //     selectedCurrency={match.selectedCurrency}
                  //     selectedPaymentMethod={match.selectedPaymentMethod}
                  //   />
                  // ) :
                  undefined // TODO: check this
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
                  {/* <UnmatchButton
                    {...{ match, offer }}
                    interruptMatching={onInterruptMatch}
                    setShowMatchedCard={setShowMatchedCard}
                  /> */}
                </View>
              </>
            )}
          </View>
        </GradientBorder>
      </View>
      {!sellOfferTradeRequestPerformedBySelfUser &&
        !canInstantTradeWithSellOffer && (
          <PerformTradeRequestButton
            maxMiningFeeRate={maxMiningFeeRate || 5}
            selectedPaymentData={selectedPaymentData}
            selectedCurrency={selectedCurrency}
            sellOfferId={sellOffer.id}
            selfUser={selfUser}
            sellOfferUser={sellOfferUser}
            sellOfferTradeRequestPerformedBySelfUserRefetch={
              sellOfferTradeRequestPerformedBySelfUserRefetch
            }
          />
        )}
      {!sellOfferTradeRequestPerformedBySelfUser &&
        canInstantTradeWithSellOffer && (
          <InstantTradeSlider
            maxMiningFeeRate={maxMiningFeeRate || 5}
            selectedPaymentData={selectedPaymentData}
            selectedCurrency={selectedCurrency}
            sellOfferId={sellOffer.id}
            selfUser={selfUser}
            sellOfferUser={sellOfferUser}
            navigation={navigation}
          />
        )}
      {sellOfferTradeRequestPerformedBySelfUser && selfUser && (
        <>
          <RemoveTradeRequestButton
            sellOfferId={sellOffer.id}
            sellOfferTradeRequestPerformedBySelfUserRefetch={
              sellOfferTradeRequestPerformedBySelfUserRefetch
            }
          />
          <Button
            style={[
              tw`flex-row items-center self-center justify-center py-2 gap-10px`,
              tw`bg-primary-main`,
            ]}
            onPress={() => {
              goToChat(navigation, sellOffer.id, selfUser.id);
            }}
          >
            Chat
          </Button>
        </>
      )}
    </>
  );
}

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

const InstantTradeSlider = ({
  selectedPaymentData,
  maxMiningFeeRate,
  selectedCurrency,
  sellOfferId,
  selfUser,
  sellOfferUser,
  navigation,
}: {
  maxMiningFeeRate?: number;
  selectedPaymentData?: PaymentData;
  selectedCurrency?: Currency;
  sellOfferId: string;
  selfUser?: User;
  sellOfferUser?: PublicUser;
  navigation: StackNavigation;
}) => {
  const label = i18n("matchDetails.action.instantTrade");

  const [showUnlockedSlider, setShowUnlockedSlider] = useState(false);

  const onConfirm = () => {
    setShowUnlockedSlider(true);
    performInstantTrade({
      selectedPaymentData,
      maxMiningFeeRate,
      selectedCurrency,
      sellOfferId,
      selfUser,
      sellOfferUser,
      navigation,
    });
  };

  if (showUnlockedSlider) return <UnlockedSlider label={label} />;

  return <ConfirmSlider label1={label} onConfirm={onConfirm} enabled={true} />;
};
const goToChat = async (
  navigation: StackNavigation,
  sellOfferId: string,
  userId: string,
): Promise<void> => {
  navigation.navigate("tradeRequestChat", {
    offerId: sellOfferId,
    offerType: "sell",
    requestingUserId: userId,
  });
};

const RemoveTradeRequestButton = ({
  sellOfferId,
  sellOfferTradeRequestPerformedBySelfUserRefetch,
}: {
  sellOfferId: string;
  sellOfferTradeRequestPerformedBySelfUserRefetch: Function;
}) => {
  const onPress = async () => {
    await peachAPI.private.peach069.removePerformedSellOfferTradeRequest({
      sellOfferId,
    });

    sellOfferTradeRequestPerformedBySelfUserRefetch();
  };

  return (
    <Button
      style={[
        tw`flex-row items-center self-center justify-center py-2 gap-10px`,
        tw`bg-primary-main`,
      ]}
      onPress={onPress}
    >
      {i18n("matchDetails.action.unrequestTrade")}
    </Button>
  );
};

const SYMMETRIC_KEY_BYTES = 32;
function PerformTradeRequestButton({
  selectedPaymentData,
  maxMiningFeeRate,
  selectedCurrency,
  sellOfferId,
  selfUser,
  sellOfferUser,
  sellOfferTradeRequestPerformedBySelfUserRefetch,
}: {
  maxMiningFeeRate?: number;
  selectedPaymentData?: PaymentData;
  selectedCurrency?: Currency;
  sellOfferId: string;
  selfUser?: User;
  sellOfferUser?: PublicUser;
  sellOfferTradeRequestPerformedBySelfUserRefetch: Function;
}) {
  const onPress = async () => {
    if (!peachWallet) throw Error("Peach Wallet not ready");
    if (
      !maxMiningFeeRate ||
      !selectedPaymentData ||
      !selectedCurrency ||
      !peachWallet ||
      !selfUser ||
      !sellOfferUser
    )
      throw Error("values not ready");
    const { address: releaseAddress, index } = await peachWallet.getAddress();

    const message = getMessageToSignForAddress(selfUser.id, releaseAddress);

    const releaseAddressMessageSignature = peachWallet.signMessage(
      message,
      index,
    );

    const symmetricKey = (await getRandom(SYMMETRIC_KEY_BYTES)).toString("hex");
    const { encrypted, signature } = await signAndEncrypt(
      symmetricKey,
      [
        ...selfUser.pgpPublicKeys.map((pgp) => pgp.publicKey),
        ...sellOfferUser.pgpPublicKeys.map((pgp) => pgp.publicKey),
      ].join("\n"),
    );

    const decryptionResult = await decryptSymmetricKey(encrypted, signature, [
      ...selfUser.pgpPublicKeys,
      ...sellOfferUser.pgpPublicKeys,
    ]);
    if (!decryptionResult)
      throw Error("Couldnt decrypt the created symmetric key");
    const encryptedPaymentData = await encryptPaymentData(
      cleanPaymentData(selectedPaymentData),
      symmetricKey,
    );
    if (!encryptedPaymentData)
      return { error: "PAYMENTDATA_ENCRYPTION_FAILED" };
    const hashedPaymentData = getHashedPaymentData([selectedPaymentData]);

    await peachAPI.private.peach069.performSellOfferTradeRequest({
      sellOfferId,
      paymentMethod: selectedPaymentData.type,
      currency: selectedCurrency,
      paymentDataHashed: hashedPaymentData,
      paymentDataEncrypted: encryptedPaymentData.encrypted,
      paymentDataSignature: encryptedPaymentData.signature,
      symmetricKeyEncrypted: encrypted,
      symmetricKeySignature: signature,
      maxMiningFeeRate: maxMiningFeeRate,
      releaseAddress,
      releaseAddressMessageSignature,
    });

    sellOfferTradeRequestPerformedBySelfUserRefetch();
  };

  return (
    <Button
      style={[
        tw`flex-row items-center self-center justify-center py-2 gap-10px`,
        tw`bg-primary-main`,
      ]}
      onPress={onPress}
      disabled={
        !maxMiningFeeRate ||
        !selectedPaymentData ||
        !selectedCurrency ||
        !peachWallet ||
        !selfUser ||
        !sellOfferUser
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
  sellOffer: SellOffer;
  selectedCurrency: Currency;
  priceBook: Pricebook;
  // selectedPaymentMethod: PaymentMethod | undefined;
};

function SellerPriceInfo({
  sellOffer,
  selectedCurrency,
  priceBook,
}: PriceInfoProps) {
  const premium = sellOffer.premium; // TODO: handle match
  const conversionPriceOfCurrency = priceBook[selectedCurrency];
  if (!conversionPriceOfCurrency)
    throw Error("invalid price conversion for currency");
  const price = (conversionPriceOfCurrency * sellOffer.amount) / SATSINBTC;
  return (
    <PriceInfo
      amount={sellOffer.amount} // TODO: handle match
      price={price}
      currency={selectedCurrency}
      premium={premium}
      miningFeeWarning={<MiningFeeWarning amount={sellOffer.amount} />}
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
