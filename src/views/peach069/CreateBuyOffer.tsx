import { type ReactElement, useEffect, useMemo, useRef, useState } from "react";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInput,
  TextInputEndEditingEventData,
  TouchableOpacity,
  View,
} from "react-native";
import { interpolate } from "react-native-reanimated";
import { shallow } from "zustand/shallow";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/buttons/Button";
import { Checkbox } from "../../components/inputs/Checkbox";
import { Toggle } from "../../components/inputs/Toggle";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PremiumInput } from "../../components/PremiumInput";
import { PeachText } from "../../components/text/PeachText";
import { TouchableIcon } from "../../components/TouchableIcon";
import { CENT, SATSINBTC } from "../../constants";
import { useBitcoinPrices } from "../../hooks/useBitcoinPrices";
import { useKeyboard } from "../../hooks/useKeyboard";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { HelpPopup } from "../../popups/HelpPopup";
import { useConfigStore } from "../../store/configStore/configStore";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { round } from "../../utils/math/round";
import { keys } from "../../utils/object/keys";
import { cleanPaymentData } from "../../utils/paymentMethod/cleanPaymentData";
import { signAndEncrypt } from "../../utils/pgp/signAndEncrypt";
import { priceFormat } from "../../utils/string/priceFormat";
import { BuyBitcoinHeader } from "../offerPreferences/components/BuyBitcoinHeader";
import { CreateMultipleBuyOffers } from "../offerPreferences/components/createMultipleBuyOffers";
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
  const setBuyOfferMulti = useOfferPreferences(
    (state) => state.setBuyOfferMulti,
  );

  const [currency, setCurrency] = useState<Currency | undefined>();

  setBuyOfferMulti(undefined);

  return (
    <PreferenceScreen
      isSliding={isSliding}
      header={<PreferenceHeader />}
      button={<PublishOfferButton />}
    >
      <PreferenceMethods type="buy" setCurrency={setCurrency} />
      <AmountSelector setIsSliding={setIsSliding} currency={currency} />
      <CreateMultipleOffersContainer />
      <InstantTrade />
      <PreferenceWalletSelector />
    </PreferenceScreen>
  );
}

function InstantTrade() {
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

  const { isDarkMode } = useThemeStore();
  const backgroundColor = isDarkMode
    ? tw.color("card")
    : tw.color("success-mild-1-color");
  return (
    <Section.Container style={{ backgroundColor }}>
      <View style={tw`flex-row items-center self-stretch justify-between`}>
        <Toggle onPress={onToggle} enabled={enableInstantTrade} red={false} />
        <Section.Title>
          {i18n("offerPreferences.feature.instantTrade")}
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
            green
          >
            {i18n("offerPreferences.filters.noNewUsers")}
          </Checkbox>
          <Checkbox
            checked={criteria.minReputation !== 0}
            style={tw`self-stretch`}
            onPress={toggleMinReputation}
            green
          >
            {i18n("offerPreferences.filters.minReputation", "4.5")}
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

function AmountSelector({
  setIsSliding,
  currency,
}: {
  setIsSliding: (isSliding: boolean) => void;
  currency?: Currency;
}) {
  return (
    <AmountSelectorComponent setIsSliding={setIsSliding} currency={currency} />
  );
}

type SellAmountSliderProps = {
  trackWidth: number;
  setIsSliding: (isSliding: boolean) => void;
};

function SellAmountSlider({ trackWidth, setIsSliding }: SellAmountSliderProps) {
  const [, maxLimit] = useTradingAmountLimits("sell");

  const trackMax = trackWidth - sliderWidth;
  const trackDelta = trackMax - trackMin;

  const getAmountInBounds = useAmountInBounds(trackWidth, "sell");

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

function FiatInput({ currency }: { currency?: Currency }) {
  const [amount, setAmount] = useOfferPreferences((state) => [
    state.createBuyOfferAmount,
    state.setCreateBuyOfferAmount,
  ]);
  const inputRef = useRef<TextInput>(null);

  const { displayCurrency, bitcoinPrice, fiatPrice } = useBitcoinPrices(
    amount,
    currency,
  );
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
  currency,
}: {
  setIsSliding: (isSliding: boolean) => void;
  currency?: Currency;
}) {
  const trackWidth = useTrackWidth();

  return (
    <AmountSelectorContainer
      type="buy"
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
          <FiatInput currency={currency} />
        </>
      }
    />
  );
}

function AmountSelectorContainer({
  slider,
  inputs,
  type = "sell",
}: {
  slider?: ReactElement;
  inputs?: ReactElement;
  type?: "buy" | "sell";
}) {
  const { isDarkMode } = useThemeStore();
  const backgroundColor = isDarkMode
    ? tw.color("card")
    : tw.color("success-mild-1-color");

  return (
    <Section.Container style={{ backgroundColor }}>
      <Section.Title>{i18n("offerPreferences.amountToBuy")}</Section.Title>
      <View style={tw`gap-5`}>
        <View style={tw`gap-2`}>
          <View style={tw`flex-row gap-10px`}>{inputs}</View>
          {slider}
        </View>
        <Premium type={type} />
      </View>
    </Section.Container>
  );
}

function Premium({ type = "sell" }: { type?: "buy" | "sell" }) {
  return (
    <View style={tw`self-stretch gap-1`}>
      <PremiumInputComponent type={type} />
      <CurrentPrice />
    </View>
  );
}

function PremiumInputComponent({ type = "sell" }: { type?: "buy" | "sell" }) {
  const [premium, setPremium] = useOfferPreferences((state) => [
    state.createBuyOfferPremium,
    state.setCreateBuyOfferPremium,
  ]);
  return (
    <PremiumInput
      premium={premium}
      setPremium={setPremium}
      incrementBy={1}
      type={type}
    />
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
  const { amount, meansOfPayment, paymentData, premium, minReputation, multi } =
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
        multi: state.buyOfferMulti,
      }),
      shallow,
    );

  const { instantTradeCriteria } = useOfferPreferences(
    (state) => ({
      instantTradeCriteria: state.instantTrade
        ? state.instantTradeCriteria
        : undefined,
    }),
    shallow,
  );

  const originalPaymentData = useOfferPreferences(
    (state) => state.originalPaymentData,
  );
  // const methodsAreValid = originalPaymentData.every(isValidPaymentData);
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
  const formValid = rangeIsValid; // && methodsAreValid;
  const payoutToPeachWallet = useSettingsStore(
    (state) => state.payoutToPeachWallet,
  );
  const { isLoading: isSyncingWallet } = useSyncWallet({
    enabled: payoutToPeachWallet,
  });

  const peachPGPPublicKey = useConfigStore((state) => state.peachPGPPublicKey);

  const getPaymentData = async () => {
    if (instantTradeCriteria !== undefined) {
      const selectedMethods = keys(paymentData);
      const cleanedData = selectedMethods.map((method) => {
        const originalData = originalPaymentData.find((e) => e.type === method);
        return originalData ? cleanPaymentData(originalData) : null;
      });

      const encryptedData = await Promise.all(
        cleanedData.map((data) =>
          data ? signAndEncrypt(JSON.stringify(data), peachPGPPublicKey) : null,
        ),
      );

      const finalPaymentData = encryptedData.reduce(
        (acc, encryptedDatum, index) => {
          if (!encryptedDatum) return acc;
          const { encrypted, signature } = encryptedDatum;
          const method = selectedMethods[index];
          return {
            ...acc,
            [method]: {
              ...paymentData[method],
              encrypted,
              signature,
            },
          };
        },
        {},
      );

      return finalPaymentData;
    }
    return paymentData;
  };

  const [paymentDataToPublish, setPaymentDataToPublish] = useState(paymentData);

  useEffect(() => {
    const getPaymentDataToPublishCallback = async () => {
      setPaymentDataToPublish(await getPaymentData());
    };
    getPaymentDataToPublishCallback();
  }, [instantTradeCriteria, paymentData]);

  const { mutate: publishOffer, isPending: isPublishing } = useCreateBuyOffer({
    amount,
    meansOfPayment,
    paymentData: paymentDataToPublish,
    premium,
    instantTradeCriteria,
    multi,
  });
  const showErrorBanner = useShowErrorBanner();
  const showPublishingError = () => {
    let errorMessage;
    const errorArgs: string[] = [];
    if (!originalPaymentData.length) {
      errorMessage = "PAYMENT_METHOD_MISSING";
    } else {
      errorMessage = "GENERAL_ERROR";
    }
    showErrorBanner(errorMessage, errorArgs);
  };

  const shouldLookDisabled =
    !formValid || isSyncingWallet || originalPaymentData.length === 0;

  const pressPublish = () => {
    if (shouldLookDisabled) {
      showPublishingError();
    }
    if (!shouldLookDisabled) {
      publishOffer();
    }
  };

  return (
    <CreateBuyOfferButton
      onPress={() => pressPublish()}
      disabled={shouldLookDisabled}
      loading={isPublishing || isSyncingWallet}
    />
  );
}

type CreateBuyOfferButtonProps = {
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
};

const CreateMultipleOffersContainer = () => {
  const setPopup = useSetPopup();

  const { isDarkMode } = useThemeStore();
  const backgroundColor = isDarkMode
    ? tw.color("card")
    : tw.color("success-mild-1-color");
  return (
    <Section.Container
      style={[tw`flex-row items-start justify-between`, { backgroundColor }]}
    >
      <CreateMultipleBuyOffers />
      <TouchableIcon
        id="helpCircle"
        iconColor={tw.color("info-light")}
        onPress={() => setPopup(<HelpPopup id="createMultiple" />)}
      />
    </Section.Container>
  );
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
      style={tw`self-center px-5 py-3 ${disabled ? "bg-success-mild-1-color" : "bg-success-main"} min-w-166px`}
      onPress={onPress}
      loading={loading}
    >
      {i18n("offer.create.buy")}
    </Button>
  );
}
