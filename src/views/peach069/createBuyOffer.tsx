import { useMemo, useRef, useState } from "react";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInput,
  TextInputEndEditingEventData,
  View,
} from "react-native";
import { interpolate } from "react-native-reanimated";
import { shallow } from "zustand/shallow";
import { Button } from "../../components/buttons/Button";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PremiumInput } from "../../components/PremiumInput";
import { PeachText } from "../../components/text/PeachText";
import { CENT, SATSINBTC } from "../../constants";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { HelpPopup } from "../../popups/HelpPopup";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { round } from "../../utils/math/round";
import { isValidPaymentData } from "../../utils/paymentMethod/isValidPaymentData";
import { priceFormat } from "../../utils/string/priceFormat";
import { BuyBitcoinHeader } from "../offerPreferences/components/BuyBitcoinHeader";
import { MarketInfo } from "../offerPreferences/components/MarketInfo";
import { PreferenceMethods } from "../offerPreferences/components/PreferenceMethods";
import { PreferenceScreen } from "../offerPreferences/components/PreferenceScreen";
import {
  SatsInputComponent,
  textStyle,
} from "../offerPreferences/components/SatsInputComponent";
import { Section } from "../offerPreferences/components/Section";
import { Slider, sliderWidth } from "../offerPreferences/components/Slider";
import { SliderTrack } from "../offerPreferences/components/SliderTrack";
import { PayoutWalletSelector } from "../offerPreferences/PayoutWalletSelector";
import { inputContainerStyle } from "../offerPreferences/SellOfferPreferences";
import { trackMin } from "../offerPreferences/utils/constants";
import { enforceDigitFormat } from "../offerPreferences/utils/enforceDigitFormat";
import { useCreateBuyOffer } from "../offerPreferences/utils/peach069/useCreateBuyOffer";
import { useAmountInBounds } from "../offerPreferences/utils/useAmountInBounds";
import { useRestrictSatsAmount } from "../offerPreferences/utils/useRestrictSatsAmount";
import { useTrackWidth } from "../offerPreferences/utils/useTrackWidth";
import { useTradingAmountLimits } from "../offerPreferences/utils/useTradingAmountLimits";
import {
  CLIENT_RATING_RANGE,
  SERVER_RATING_RANGE,
} from "../settings/profile/profileOverview/Rating";
import { useSyncWallet } from "../wallet/hooks/useSyncWallet";

export function CreateBuyOffer() {
  const [isSliding, setIsSliding] = useState(false);

  return (
    <PreferenceScreen
      isSliding={isSliding}
      header={<PreferenceHeader />}
      button={<PublishOfferButton />}
    >
      <PreferenceMethods type="buy" />
      <AmountSelector setIsSliding={setIsSliding} />
      <PreferenceWalletSelector />
    </PreferenceScreen>
  );
}

function PreferenceWalletSelector() {
  const [
    payoutToPeachWallet,
    payoutAddress,
    payoutAddressLabel,
    setPayoutToPeachWallet,
  ] = useSettingsStore(
    (state) => [
      state.payoutToPeachWallet,
      state.payoutAddress,
      state.payoutAddressLabel,
      state.setPayoutToPeachWallet,
    ],
    shallow,
  );
  const navigation = useStackNavigation();

  const onExternalWalletPress = () => {
    if (payoutAddress) {
      setPayoutToPeachWallet(false);
    } else {
      navigation.navigate("payoutAddress");
    }
  };

  const onPeachWalletPress = () => setPayoutToPeachWallet(true);
  return (
    <PayoutWalletSelector
      peachWalletSelected={payoutToPeachWallet}
      customAddress={payoutAddress}
      customAddressLabel={payoutAddressLabel}
      onPeachWalletPress={onPeachWalletPress}
      onExternalWalletPress={onExternalWalletPress}
    />
  );
}

function PreferenceHeader() {
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="buyingBitcoin" />);
  return (
    <BuyBitcoinHeader icons={[{ ...headerIcons.help, onPress: showHelp }]} />
  );
}

function PreferenceMarketInfo() {
  const offerPreferenes = useOfferPreferences(
    (state) => ({
      buyAmountRange: state.buyAmountRange,
      meansOfPayment: state.meansOfPayment,
      maxPremium: state.filter.buyOffer.shouldApplyMaxPremium
        ? state.filter.buyOffer.maxPremium ?? undefined
        : undefined,
      minReputation: interpolate(
        state.filter.buyOffer.minReputation ?? 0,
        CLIENT_RATING_RANGE,
        SERVER_RATING_RANGE,
      ),
    }),
    shallow,
  );
  return <MarketInfo type="sellOffers" {...offerPreferenes} />;
}

function AmountSelector({
  setIsSliding,
}: {
  setIsSliding: (isSliding: boolean) => void;
}) {
  return <AmountSelectorComponent setIsSliding={setIsSliding} />;
}

type SellAmountSliderProps = {
  trackWidth: number;
  setIsSliding: (isSliding: boolean) => void;
};

function SellAmountSlider({ trackWidth, setIsSliding }: SellAmountSliderProps) {
  const [, maxLimit] = useTradingAmountLimits("buy");

  const trackMax = trackWidth - sliderWidth;
  const trackDelta = trackMax - trackMin;

  const getAmountInBounds = useAmountInBounds(trackWidth, "buy");

  const [amount, setAmount] = useOfferPreferences((state) => [
    state.createBuyOfferAmount,
    state.setCreateBuyOfferAmount,
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
      type="buy"
      iconId="chevronsUp"
      transform={[{ translateX }]}
    />
  );
}

function SatsInput() {
  const [amount, setAmount] = useOfferPreferences((state) => [
    state.createBuyOfferAmount,
    state.setCreateBuyOfferAmount,
  ]);
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState(String(amount));
  const restrictAmount = useRestrictSatsAmount("buy");

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
  const [amount, setAmount] = useOfferPreferences((state) => [
    state.createBuyOfferAmount,
    state.setCreateBuyOfferAmount,
  ]);
  const inputRef = useRef<TextInput>(null);

  const { displayCurrency, bitcoinPrice, fiatPrice } = useBitcoinPrices(amount);
  const [inputValue, setInputValue] = useState(fiatPrice.toString());

  const restrictAmount = useRestrictSatsAmount("buy");

  const onFocus = () => {
    setInputValue(fiatPrice.toString());
  };
  const replaceAllCommasWithDots = (value: string) => value.replace(/,/gu, ".");
  const removeAllButOneDot = (value: string) =>
    value.replace(/\.(?=.*\.)/gu, "");
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
      Math.round((newFiatValue / bitcoinPrice) * SATSINBTC),
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

  const { isDarkMode } = useThemeStore();

  return (
    <View
      style={[
        tw.style(inputContainerStyle),
        isDarkMode && tw`bg-transparent border-black-25`,
      ]}
    >
      <TextInput
        style={[
          tw.style(textStyle),
          isDarkMode
            ? tw`bg-transparent text-backgroundLight-light`
            : tw`text-black-100`,
        ]}
        ref={inputRef}
        value={displayValue}
        onFocus={onFocus}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        keyboardType="decimal-pad"
      />
      <PeachText
        style={[
          tw.style(textStyle),
          isDarkMode && tw`text-backgroundLight-light`,
        ]}
      >
        {" "}
        {i18n(displayCurrency)}
      </PeachText>
    </View>
  );
}

function AmountSelectorComponent({
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
          type="buy"
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
  const { isDarkMode } = useThemeStore();
  return (
    <Section.Container
      style={tw`${isDarkMode ? "bg-card" : "bg-primary-background-dark-color"}`}
    >
      <Section.Title>{i18n("offerPreferences.amountToSell")}</Section.Title>
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
const MIN_PREMIUM_INCREMENT = 0.01;
function Premium() {
  return (
    <View style={tw`self-stretch gap-1`}>
      <PremiumInputComponent />
      <CurrentPrice />
    </View>
  );
}

function PremiumInputComponent() {
  const [premium, setPremium] = useOfferPreferences((state) => [
    state.createBuyOfferPremium,
    state.setCreateBuyOfferPremium,
  ]);
  return (
    <PremiumInput premium={premium} setPremium={setPremium} incrementBy={1} />
  );
}

function CurrentPrice() {
  const displayCurrency = useSettingsStore((state) => state.displayCurrency);
  const [amount, premium] = useOfferPreferences(
    (state) => [state.createBuyOfferAmount, state.createBuyOfferPremium],
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
        (i18n("offerPreferences.currentPrice"),
        `${priceWithPremium} ${displayCurrency}`)
      }
    </PeachText>
  );
}

function PublishOfferButton() {
  const { amount, meansOfPayment, paymentData, premium, minReputation } =
    useOfferPreferences(
      (state) => ({
        amount: state.createBuyOfferAmount,
        meansOfPayment: state.meansOfPayment,
        paymentData: state.paymentData,
        premium: state.createBuyOfferPremium,
        minReputation: interpolate(
          state.filter.buyOffer.minReputation || 0,
          CLIENT_RATING_RANGE,
          SERVER_RATING_RANGE,
        ),
      }),
      shallow,
    );

  const originalPaymentData = useOfferPreferences(
    (state) => state.originalPaymentData,
  );
  const methodsAreValid = originalPaymentData.every(isValidPaymentData);
  const [minAmount, maxAmount] = useTradingAmountLimits("buy");
  const restrictAmount = useRestrictSatsAmount("buy");
  const setBuyAmountRange = useOfferPreferences(
    (state) => state.setCreateBuyOfferAmount,
  );
  const rangeIsWithinLimits = amount >= minAmount && amount <= maxAmount;
  if (!rangeIsWithinLimits) {
    setBuyAmountRange(restrictAmount(amount));
  }
  const rangeIsValid = rangeIsWithinLimits;
  const formValid = methodsAreValid && rangeIsValid;
  const payoutToPeachWallet = useSettingsStore(
    (state) => state.payoutToPeachWallet,
  );
  const { isLoading: isSyncingWallet } = useSyncWallet({
    enabled: payoutToPeachWallet,
  });
  const { mutate: publishOffer, isPending: isPublishing } = useCreateBuyOffer({
    amount,
    meansOfPayment,
    paymentData,
    premium,
    minReputation,
  });

  return (
    <CreateBuyOfferButton
      onPress={() => publishOffer()}
      disabled={
        !formValid || isSyncingWallet || originalPaymentData.length === 0
      }
      loading={isPublishing || isSyncingWallet}
    />
  );
}

type CreateBuyOfferButtonProps = {
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
};

export function CreateBuyOfferButton({
  onPress,
  disabled,
  loading,
}: CreateBuyOfferButtonProps) {
  const keyboardIsOpen = useKeyboard();
  if (keyboardIsOpen) return null;
  return (
    <Button
      style={tw`self-center px-5 py-3 bg-success-main min-w-166px`}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
    >
      {i18n("69createBuyOffer")}
    </Button>
  );
}
