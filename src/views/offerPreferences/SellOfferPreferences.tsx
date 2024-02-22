import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInput,
  TextInputEndEditingEventData,
  TouchableOpacity,
  View,
} from "react-native";
import { shallow } from "zustand/shallow";
import { MeansOfPayment } from "../../../peach-api/src/@types/payment";
import { LogoIcons } from "../../assets/logo";
import { Badge } from "../../components/Badge";
import { Header } from "../../components/Header";
import { PremiumInput } from "../../components/PremiumInput";
import { TouchableIcon } from "../../components/TouchableIcon";
import { Button } from "../../components/buttons/Button";
import { Checkbox } from "../../components/inputs/Checkbox";
import { Toggle } from "../../components/inputs/Toggle";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { CENT, SATSINBTC } from "../../constants";
import { useFeeEstimate } from "../../hooks/query/useFeeEstimate";
import { marketKeys, useMarketPrices } from "../../hooks/query/useMarketPrices";
import { offerKeys } from "../../hooks/query/useOfferDetail";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useToggleBoolean } from "../../hooks/useToggleBoolean";
import { HelpPopup } from "../../popups/HelpPopup";
import { useConfigStore } from "../../store/configStore/configStore";
import { useOfferPreferences } from "../../store/offerPreferences";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import tw from "../../styles/tailwind";
import { headerIcons } from "../../utils/layout/headerIcons";
import { convertFiatToSats } from "../../utils/market/convertFiatToSats";
import { getTradingAmountLimits } from "../../utils/market/getTradingAmountLimits";
import { round } from "../../utils/math/round";
import { keys } from "../../utils/object/keys";
import { defaultFundingStatus } from "../../utils/offer/constants";
import { saveOffer } from "../../utils/offer/saveOffer";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { isValidPaymentData } from "../../utils/paymentMethod/isValidPaymentData";
import { peachAPI } from "../../utils/peachAPI";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
import { priceFormat } from "../../utils/string/priceFormat";
import { isDefined } from "../../utils/validation/isDefined";
import { peachWallet } from "../../utils/wallet/setWallet";
import { useWalletState } from "../../utils/wallet/walletStore";
import { getFundingAmount } from "../fundEscrow/helpers/getFundingAmount";
import { useCreateEscrow } from "../fundEscrow/hooks/useCreateEscrow";
import { useFundFromPeachWallet } from "../fundEscrow/hooks/useFundFromPeachWallet";
import { WalletSelector } from "./WalletSelector";
import { FundMultipleOffers } from "./components/FundMultipleOffers";
import { MarketInfo } from "./components/MarketInfo";
import { PreferenceMethods } from "./components/PreferenceMethods";
import { PreferenceScreen } from "./components/PreferenceScreen";
import { SatsInputComponent, textStyle } from "./components/SatsInputComponent";
import { Section } from "./components/Section";
import { Slider, sliderWidth } from "./components/Slider";
import { SliderTrack } from "./components/SliderTrack";
import { useFilteredMarketStats } from "./components/useFilteredMarketStats";
import { trackMin } from "./utils/constants";
import { enforceDigitFormat } from "./utils/enforceDigitFormat";
import { useAmountInBounds } from "./utils/useAmountInBounds";
import { usePostSellOffer } from "./utils/usePostSellOffer";
import { useRestrictSatsAmount } from "./utils/useRestrictSatsAmount";
import { useTrackWidth } from "./utils/useTrackWidth";
import { useTradingAmountLimits } from "./utils/useTradingAmountLimits";
import { useTranslate } from "@tolgee/react";

export function SellOfferPreferences() {
  const [isSliding, setIsSliding] = useState(false);
  return (
    <PreferenceScreen
      header={<SellHeader />}
      button={<SellAction />}
      isSliding={isSliding}
    >
      <SellPreferenceMarketInfo />
      <PreferenceMethods type="sell" />
      <CompetingOfferStats />
      <AmountSelector setIsSliding={setIsSliding} />
      <FundMultipleOffersContainer />
      <InstantTrade />
      <RefundWalletSelector />
    </PreferenceScreen>
  );
}

function SellPreferenceMarketInfo() {
  const preferences = useOfferPreferences(
    (state) => ({
      meansOfPayment: state.meansOfPayment,
      maxPremium: state.premium,
      sellAmount: state.sellAmount,
    }),
    shallow,
  );
  return <MarketInfo type="buyOffers" {...preferences} />;
}

function usePastOffersStats({
  meansOfPayment,
}: {
  meansOfPayment: MeansOfPayment;
}) {
  return useQuery({
    queryKey: marketKeys.filteredPastOfferStats(meansOfPayment),
    queryFn: async (context) => {
      const preferences = context.queryKey[3];
      const { result } =
        await peachAPI.public.market.getPastOffersStats(preferences);
      if (!result) throw new Error("no past offers stats found");
      return result;
    },
    placeholderData: (data) => {
      if (data) return data;
      return {
        avgPremium: 0,
      };
    },
  });
}

function CompetingOfferStats() {
  const text = tw`text-center text-primary-main subtitle-2`;
  const { t } = useTranslate("offerPreferences");

  const meansOfPayment = useOfferPreferences((state) => state.meansOfPayment);
  const { data: pastOfferData } = usePastOffersStats({ meansOfPayment });
  const { data: marketStats } = useFilteredMarketStats({
    type: "ask",
    meansOfPayment,
  });

  return (
    <Section.Container style={tw`gap-1 py-0`}>
      <PeachText style={text}>
        {t("offerPreferences.competingSellOffers", {
          offers: String(marketStats.offersWithinRange.length),
        })}
      </PeachText>
      <PeachText style={text}>
        {t("offerPreferences.premiumOfCompletedTrades", {
          premium: String(pastOfferData?.avgPremium),
        })}
      </PeachText>
    </Section.Container>
  );
}

function AmountSelector({
  setIsSliding,
}: {
  setIsSliding: (isSliding: boolean) => void;
}) {
  const trackWidth = useTrackWidth();

  return (
    <AmountSelectorContainer
      slider={
        <SliderTrack
          slider={
            <SellAmountSlider
              setIsSliding={setIsSliding}
              trackWidth={trackWidth}
            />
          }
          trackWidth={trackWidth}
          type="sell"
        />
      }
      inputs={
        <>
          <SatsInput />
          <FiatInput />
        </>
      }
    />
  );
}

function AmountSelectorContainer({
  slider,
  inputs,
}: {
  slider?: JSX.Element;
  inputs?: JSX.Element;
}) {
  const { t } = useTranslate("offerPreferences");
  return (
    <Section.Container style={tw`bg-primary-background-dark`}>
      <Section.Title>{t("offerPreferences.amountToSell")}</Section.Title>
      <View style={tw`gap-5`}>
        <View style={tw`gap-2`}>
          <View style={tw`flex-row gap-10px`}>{inputs}</View>
          {slider}
        </View>
        <Premium />
      </View>
    </Section.Container>
  );
}

const replaceAllCommasWithDots = (value: string) => value.replace(/,/gu, ".");
const removeAllButOneDot = (value: string) => value.replace(/\.(?=.*\.)/gu, "");
const MIN_PREMIUM_INCREMENT = 0.01;
function Premium() {
  const { t } = useTranslate("offerPreferences");
  const preferences = useOfferPreferences(
    (state) => ({
      maxPremium: state.premium - MIN_PREMIUM_INCREMENT,
      meansOfPayment: state.meansOfPayment,
    }),
    shallow,
  );
  const { data } = useFilteredMarketStats({ type: "ask", ...preferences });
  return (
    <View style={tw`self-stretch gap-1`}>
      <PremiumInputComponent />
      <CurrentPrice />
      <PeachText style={tw`text-center text-primary-main subtitle-2`}>
        {t("offerPreferences.competingSellOffersBelowThisPremium", {
          offers: String(data.offersWithinRange.length),
        })}
      </PeachText>
    </View>
  );
}

function PremiumInputComponent() {
  const [premium, setPremium] = useOfferPreferences((state) => [
    state.premium,
    state.setPremium,
  ]);
  return (
    <PremiumInput premium={premium} setPremium={setPremium} incrementBy={1} />
  );
}

function CurrentPrice() {
  const { t } = useTranslate("offerPreferences");
  const displayCurrency = useSettingsStore((state) => state.displayCurrency);
  const [amount, premium] = useOfferPreferences(
    (state) => [state.sellAmount, state.premium],
    shallow,
  );
  const { fiatPrice } = useBitcoinPrices(amount);
  const priceWithPremium = useMemo(
    () => round(fiatPrice * (1 + premium / CENT), 2),
    [fiatPrice, premium],
  );

  return (
    <PeachText style={tw`text-center body-s`}>
      {
        (t("offerPreferences.currentPrice"),
        `${priceWithPremium} ${displayCurrency}`)
      }
    </PeachText>
  );
}

type SellAmountSliderProps = {
  trackWidth: number;
  setIsSliding: (isSliding: boolean) => void;
};

function SellAmountSlider({ trackWidth, setIsSliding }: SellAmountSliderProps) {
  const { data } = useMarketPrices();
  const [, maxLimit] = getTradingAmountLimits(data?.CHF || 0, "sell");

  const trackMax = trackWidth - sliderWidth;
  const trackDelta = trackMax - trackMin;

  const getAmountInBounds = useAmountInBounds(trackWidth, "sell");

  const [amount, setAmount] = useOfferPreferences((state) => [
    state.sellAmount,
    state.setSellAmount,
  ]);
  const translateX = (amount / maxLimit) * trackDelta;

  const onDrag = ({ nativeEvent: { pageX } }: GestureResponderEvent) => {
    const bounds = [trackMin, trackMax] as const;
    const newAmount = getAmountInBounds(pageX, bounds);

    setAmount(newAmount);
  };

  return (
    <Slider
      trackWidth={trackWidth}
      setIsSliding={setIsSliding}
      onDrag={onDrag}
      type="sell"
      iconId="chevronsUp"
      transform={[{ translateX }]}
    />
  );
}

export const inputContainerStyle = [
  "items-center justify-center flex-1 bg-primary-background-light flex-row h-7",
  "border rounded-lg border-black-25",
];

function SatsInput() {
  const [amount, setAmount] = useOfferPreferences((state) => [
    state.sellAmount,
    state.setSellAmount,
  ]);
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState(String(amount));
  const restrictAmount = useRestrictSatsAmount("sell");

  const onFocus = () => setInputValue("0");

  const onChangeText = (value: string) =>
    setInputValue(enforceDigitFormat(value));

  const onEndEditing = ({
    nativeEvent: { text },
  }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const newAmount = restrictAmount(Number(enforceDigitFormat(text)));
    setAmount(newAmount);
    setInputValue(String(newAmount));
  };

  const displayValue = inputRef.current?.isFocused()
    ? inputValue
    : String(amount);

  return (
    <SatsInputComponent
      value={displayValue}
      ref={inputRef}
      onFocus={onFocus}
      onChangeText={onChangeText}
      onEndEditing={onEndEditing}
    />
  );
}

function FiatInput() {
  const { t } = useTranslate("offerPreferences");
  const [amount, setAmount] = useOfferPreferences((state) => [
    state.sellAmount,
    state.setSellAmount,
  ]);
  const inputRef = useRef<TextInput>(null);

  const { displayCurrency, bitcoinPrice, fiatPrice } = useBitcoinPrices(amount);
  const [inputValue, setInputValue] = useState(fiatPrice.toString());

  const restrictAmount = useRestrictSatsAmount("sell");

  const onFocus = () => {
    setInputValue(fiatPrice.toString());
  };

  const onChangeText = (value: string) => {
    value = removeAllButOneDot(replaceAllCommasWithDots(value));
    value = value.replace(/[^0-9.]/gu, "");
    setInputValue(value);
  };

  const onEndEditing = ({
    nativeEvent: { text },
  }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const newFiatValue = Number(text);
    const newSatsAmount = restrictAmount(
      convertFiatToSats(newFiatValue, bitcoinPrice),
    );
    setAmount(newSatsAmount);
    const restrictedFiatValue = priceFormat(
      (newSatsAmount / SATSINBTC) * bitcoinPrice,
    );
    setInputValue(restrictedFiatValue);
  };

  const displayValue = inputRef.current?.isFocused()
    ? inputValue
    : priceFormat(fiatPrice);
  return (
    <View style={tw.style(inputContainerStyle)}>
      <TextInput
        style={tw.style(textStyle)}
        ref={inputRef}
        value={displayValue}
        onFocus={onFocus}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        keyboardType="decimal-pad"
      />
      <PeachText style={tw.style(textStyle)}> {t(displayCurrency)}</PeachText>
    </View>
  );
}

function FundMultipleOffersContainer() {
  const setPopup = useSetPopup();
  return (
    <Section.Container
      style={tw`flex-row items-start justify-between bg-primary-background-dark`}
    >
      <FundMultipleOffers />
      <TouchableIcon
        id="helpCircle"
        iconColor={tw.color("info-light")}
        onPress={() => setPopup(<HelpPopup id="fundMultiple" />)}
      />
    </Section.Container>
  );
}

function InstantTrade() {
  const { t } = useTranslate("offerPreferences");
  const [
    enableInstantTrade,
    toggle,
    criteria,
    toggleMinTrades,
    toggleBadge,
    toggleMinReputation,
  ] = useOfferPreferences(
    (state) => [
      state.instantTrade,
      state.toggleInstantTrade,
      state.instantTradeCriteria,
      state.toggleMinTrades,
      state.toggleBadge,
      state.toggleMinReputation,
    ],
    shallow,
  );
  const [hasSeenPopup, setHasSeenPopup] = useOfferPreferences(
    (state) => [
      state.hasSeenInstantTradePopup,
      state.setHasSeenInstantTradePopup,
    ],
    shallow,
  );
  const setPopup = useSetPopup();
  const onHelpIconPress = () => {
    setPopup(<HelpPopup id="instantTrade" />);
    setHasSeenPopup(true);
  };

  const onToggle = () => {
    if (!hasSeenPopup) {
      onHelpIconPress();
    }
    toggle();
  };

  return (
    <Section.Container style={tw`bg-primary-background-dark`}>
      <View style={tw`flex-row items-center self-stretch justify-between`}>
        <Toggle onPress={onToggle} enabled={enableInstantTrade} />
        <Section.Title>
          {t("offerPreferences.feature.instantTrade")}
        </Section.Title>
        <TouchableIcon
          id="helpCircle"
          iconColor={tw.color("info-light")}
          onPress={onHelpIconPress}
        />
      </View>
      {enableInstantTrade && (
        <>
          <Checkbox
            checked={criteria.minTrades !== 0}
            style={tw`self-stretch`}
            onPress={toggleMinTrades}
          >
            {t("offerPreferences.filters.noNewUsers")}
          </Checkbox>
          <Checkbox
            checked={criteria.minReputation !== 0}
            style={tw`self-stretch`}
            onPress={toggleMinReputation}
          >
            {t("offerPreferences.filters.minReputation", "4.5")}
          </Checkbox>
          <View style={tw`flex-row items-start self-stretch gap-10px`}>
            <TouchableOpacity onPress={() => toggleBadge("fastTrader")}>
              <Badge
                badgeName="fastTrader"
                isUnlocked={criteria.badges.includes("fastTrader")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleBadge("superTrader")}>
              <Badge
                badgeName="superTrader"
                isUnlocked={criteria.badges.includes("superTrader")}
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </Section.Container>
  );
}

function SellAction() {
  const [fundWithPeachWallet, toggle] = useToggleBoolean();
  return (
    <>
      <FundWithPeachWallet
        fundWithPeachWallet={fundWithPeachWallet}
        toggle={toggle}
      />
      <FundEscrowButton fundWithPeachWallet={fundWithPeachWallet} />
    </>
  );
}

function FundWithPeachWallet({
  fundWithPeachWallet,
  toggle,
}: {
  fundWithPeachWallet: boolean;
  toggle: () => void;
}) {
  const { t } = useTranslate("offerPreferences");
  const { user } = useSelfUser();
  const feeRate = user?.feeRate || "halfHourFee";
  const feeEstimate = useFeeEstimate();
  const estimatedFeeRate =
    typeof feeRate === "number" ? feeRate : feeEstimate.estimatedFees[feeRate];
  const navigation = useStackNavigation();
  const onPress = () => navigation.navigate("networkFees");
  return (
    <Section.Container style={tw`flex-row justify-between`}>
      <Checkbox
        checked={fundWithPeachWallet}
        onPress={toggle}
        style={tw`flex-1`}
      >
        {t("offerPreferences.fundWithPeachWallet", {
          feeRate: String(estimatedFeeRate),
        })}
      </Checkbox>
      <TouchableIcon id="bitcoin" onPress={onPress} />
    </Section.Container>
  );
}

function FundEscrowButton({
  fundWithPeachWallet,
}: {
  fundWithPeachWallet: boolean;
}) {
  const { t } = useTranslate("offerPreferences");
  const amountRange = useTradingAmountLimits("sell");
  const [sellAmount, instantTrade] = useOfferPreferences(
    (state) => [state.sellAmount, state.instantTrade],
    shallow,
  );
  const [isPublishing, setIsPublishing] = useState(false);

  const sellAmountIsValid =
    sellAmount >= amountRange[0] && sellAmount <= amountRange[1];
  const restrictAmount = useRestrictSatsAmount("sell");
  const setSellAmount = useOfferPreferences((state) => state.setSellAmount);
  if (!sellAmountIsValid) {
    setSellAmount(restrictAmount(sellAmount));
  }

  const [refundToPeachWallet, refundAddress] = useSettingsStore(
    (state) => [state.refundToPeachWallet, state.refundAddress],
    shallow,
  );

  const sellPreferences = useOfferPreferences(
    (state) => ({
      amount: state.sellAmount,
      premium: state.premium,
      meansOfPayment: state.meansOfPayment,
      paymentData: state.paymentData,
      originalPaymentData: state.originalPaymentData,
      multi: state.multi,
      instantTradeCriteria: state.instantTrade
        ? state.instantTradeCriteria
        : undefined,
    }),
    shallow,
  );
  const paymentMethodsAreValid =
    sellPreferences.originalPaymentData.every(isValidPaymentData);
  const formValid =
    sellAmountIsValid &&
    paymentMethodsAreValid &&
    !!sellPreferences.originalPaymentData.length;
  const showErrorBanner = useShowErrorBanner();

  const { mutate: postSellOffer } = usePostSellOffer();

  const peachPGPPublicKey = useConfigStore((state) => state.peachPGPPublicKey);

  const getPaymentData = () => {
    const { paymentData, originalPaymentData } = sellPreferences;
    if (instantTrade) {
      return keys(paymentData).reduce(
        async (accPromise: Promise<OfferPaymentData>, paymentMethod) => {
          const acc = await accPromise;
          const originalData = originalPaymentData.find(
            (e) => e.type === paymentMethod,
          );
          if (originalData) {
            const cleanedData = cleanPaymentData(originalData);
            const { encrypted, signature } = await signAndEncrypt(
              JSON.stringify(cleanedData),
              peachPGPPublicKey,
            );
            return {
              ...acc,
              [paymentMethod]: {
                ...paymentData[paymentMethod],
                encrypted,
                signature,
              },
            };
          }
          return acc;
        },
        Promise.resolve({}),
      );
    }
    return Promise.resolve(paymentData);
  };

  const showPublishingError = () => {
    let errorMessage;
    let errorArgs: string[] = [];
    if (!sellAmountIsValid) {
      errorMessage = "INVALID_AMOUNT_RANGE";
      errorArgs = amountRange.map(String);
    } else if (!paymentMethodsAreValid) {
      errorMessage = "VALID_PAYMENT_DATA_MISSING";
    } else if (!sellPreferences.originalPaymentData.length) {
      errorMessage = "PAYMENT_METHOD_MISSING";
    } else {
      errorMessage = "GENERAL_ERROR";
    }
    showErrorBanner(errorMessage, errorArgs);
  };

  const queryClient = useQueryClient();
  const [registerFundMultiple, getFundMultipleByOfferId] = useWalletState(
    (state) => [state.registerFundMultiple, state.getFundMultipleByOfferId],
    shallow,
  );
  const { mutate: createEscrow } = useCreateEscrow();
  const navigation = useStackNavigation();
  const fundFromPeachWallet = useFundFromPeachWallet();

  const onPress = async () => {
    if (isPublishing) return;
    if (!peachWallet) throw new Error("Peach wallet not defined");
    if (!formValid) {
      showPublishingError();
      return;
    }
    setIsPublishing(true);
    const address = refundToPeachWallet
      ? (await peachWallet.getAddress()).address
      : refundAddress;
    if (!address) {
      setIsPublishing(false);
      return;
    }
    const paymentData = await getPaymentData();

    postSellOffer(
      {
        ...sellPreferences,
        paymentData,
        type: "ask",
        funding: defaultFundingStatus,
        returnAddress: address,
      },
      {
        onError: (error) => {
          showErrorBanner(error.message);
          setIsPublishing(false);
        },
        onSuccess: async (result, offerDraft) => {
          if (!Array.isArray(result)) {
            saveOffer({ ...offerDraft, ...result });
          } else {
            if (!peachWallet) throw new Error("Peach wallet not defined");
            result.forEach((offer) => saveOffer({ ...offerDraft, ...offer }));

            const internalAddress = await peachWallet.getInternalAddress();
            const diffToNextAddress = 10;
            const newInternalAddress = await peachWallet.getInternalAddress(
              internalAddress.index + diffToNextAddress,
            );
            registerFundMultiple(
              newInternalAddress.address,
              result.map((offer) => offer.id),
            );
          }
          const navigationParams = {
            offerId: Array.isArray(result) ? result[0].id : result.id,
          };

          const fundMultiple = getFundMultipleByOfferId(
            navigationParams.offerId,
          );
          const offerIds = fundMultiple?.offerIds || [navigationParams.offerId];
          createEscrow(offerIds, {
            onSuccess: async (res) => {
              if (fundWithPeachWallet) {
                const amount = getFundingAmount(
                  fundMultiple,
                  offerDraft.amount,
                );
                const fundingAddress =
                  fundMultiple?.address ||
                  res.find((e) => e?.offerId === navigationParams.offerId)
                    ?.escrow;
                const fundingAddresses = res
                  .filter(isDefined)
                  .map((e) => e.escrow);
                await fundFromPeachWallet({
                  offerId: navigationParams.offerId,
                  amount,
                  address: fundingAddress,
                  addresses: fundingAddresses,
                });
              }

              navigation.reset({
                index: 1,
                routes: [
                  {
                    name: "homeScreen",
                    params: {
                      screen: "yourTrades",
                      params: { tab: "yourTrades.sell" },
                    },
                  },
                  { name: "fundEscrow", params: navigationParams },
                ],
              });

              return Promise.all(
                offerIds.map((id) =>
                  queryClient.invalidateQueries({
                    queryKey: offerKeys.detail(id),
                  }),
                ),
              );
            },
          });
        },
      },
    );
  };

  const keyboardIsOpen = useKeyboard();
  if (keyboardIsOpen) return null;

  return (
    <Button
      style={[
        tw`self-center px-5 py-3 min-w-166px`,
        !formValid && tw`bg-primary-mild-1`,
      ]}
      onPress={onPress}
      loading={isPublishing}
    >
      {t("offerPreferences.fundEscrow")}
    </Button>
  );
}

function RefundWalletSelector() {
  const [
    refundToPeachWallet,
    refundAddress,
    refundAddressLabel,
    setRefundToPeachWallet,
  ] = useSettingsStore(
    (state) => [
      state.refundToPeachWallet,
      state.refundAddress,
      state.refundAddressLabel,
      state.setRefundToPeachWallet,
    ],
    shallow,
  );
  const navigation = useStackNavigation();
  const { t } = useTranslate("offerPreferences");

  const onExternalWalletPress = () => {
    if (refundAddress) {
      setRefundToPeachWallet(false);
    } else {
      navigation.navigate("refundAddress");
    }
  };

  const onPeachWalletPress = () => setRefundToPeachWallet(true);

  return (
    <WalletSelector
      title={t("offerPreferences.refundTo")}
      backgroundColor={tw.color("primary-background-dark")}
      bubbleColor="orange"
      peachWalletActive={refundToPeachWallet}
      address={refundAddress}
      addressLabel={refundAddressLabel}
      onPeachWalletPress={onPeachWalletPress}
      onExternalWalletPress={onExternalWalletPress}
    />
  );
}

function SellHeader() {
  const setPopup = useSetPopup();
  const { t } = useTranslate("unassigned");
  const onPress = () => setPopup(<HelpPopup id="sellingBitcoin" />);
  return (
    <Header
      titleComponent={
        <>
          <PeachText style={tw`h7 md:h6 text-primary-main`}>
            {t("sell")}
          </PeachText>
          <LogoIcons.bitcoinText
            style={tw`h-14px md:h-16px w-63px md:w-71px`}
          />
        </>
      }
      icons={[{ ...headerIcons.help, onPress }]}
    />
  );
}
