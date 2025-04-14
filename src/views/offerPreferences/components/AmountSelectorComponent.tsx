import { useMemo, useRef, useState } from "react";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInput,
  TextInputEndEditingEventData,
  View,
} from "react-native";
import { shallow } from "zustand/shallow";
import { Placeholder } from "../../../components/Placeholder";
import { PremiumInput } from "../../../components/PremiumInput";
import { PeachText } from "../../../components/text/PeachText";
import { CENT } from "../../../constants";
import { useBitcoinPrices } from "../../../hooks/useBitcoinPrices";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { round } from "../../../utils/math/round";
import { trackMin } from "../utils/constants";
import { enforceDigitFormat } from "../utils/enforceDigitFormat";
import { useAmountInBounds } from "../utils/useAmountInBounds";
import { useRestrictSatsAmount } from "../utils/useRestrictSatsAmount";
import { useTrackWidth } from "../utils/useTrackWidth";
import { useTradingAmountLimits } from "../utils/useTradingAmountLimits";
import { DisplayCurrencySelector } from "./DisplayCurrencySelector";
import { SatsInputComponent } from "./SatsInputComponent";
import { Section, sectionContainerGap } from "./Section";
import { Slider, sliderWidth } from "./Slider";
import { SliderTrack } from "./SliderTrack";
import { useFilteredMarketStats } from "./useFilteredMarketStats";

type Props = {
  setIsSliding: (isSliding: boolean) => void;
  range: [number, number];
  setRange: (newRange: [number, number]) => void;
};

export function AmountSelectorComponent({
  setIsSliding,
  range: [min, max],
  setRange,
}: Props) {
  const trackWidth = useTrackWidth();
  const minSliderDeltaAsAmount = useMinSliderDeltaAsAmount(trackWidth);
  const { isDarkMode } = useThemeStore();

  return (
    <Section.Container
      style={tw`${isDarkMode ? "bg-card" : "bg-success-mild-1"}`}
    >
      <View style={tw`flex-row items-center self-stretch justify-between`}>
        <Placeholder style={tw`w-6 h-6`} />
        <Section.Title>{i18n("offerPreferences.amountToBuy")}</Section.Title>
        <Placeholder style={tw`w-6 h-6`} />
      </View>
      <View style={tw`items-center self-stretch -gap-1`}>
        <BuyAmountInput
          type="min"
          minAmountDelta={minSliderDeltaAsAmount}
          range={[min, max]}
          setRange={setRange}
        />
        <PeachText style={tw`subtitle-1`}>-</PeachText>
        <BuyAmountInput
          type="max"
          minAmountDelta={minSliderDeltaAsAmount}
          range={[min, max]}
          setRange={setRange}
        />
      </View>
      <FiatPriceRange range={[min, max]} />
      <SliderTrack
        slider={
          <AmountSliders
            setIsSliding={setIsSliding}
            trackWidth={trackWidth}
            range={[min, max]}
            setRange={setRange}
          />
        }
        trackWidth={trackWidth}
        type="buy"
      />
      <BuyPremiumInput />
    </Section.Container>
  );
}

function PremiumInputComponent() {
  const [buyPremium, setBuyPremium] = useOfferPreferences((state) => [
    state.buyPremium,
    state.setBuyPremium,
  ]);
  return (
    <PremiumInput
      premium={buyPremium}
      setPremium={setBuyPremium}
      incrementBy={1}
      isBuy
    />
  );
}

function CurrentPrice() {
  const displayCurrency = useSettingsStore((state) => state.displayCurrency);
  const [buyAmountRange, premium] = useOfferPreferences(
    (state) => [state.buyAmountRange, state.buyPremium],
    shallow,
  );
  const [buyAmountRangeLow, buyAmountRangeHigh] = buyAmountRange;
  const { fiatPrice: fiatPriceLow } = useBitcoinPrices(buyAmountRangeLow);
  const priceLowWithPremium = useMemo(
    () => round(fiatPriceLow * (1 + premium / CENT), 2),
    [fiatPriceLow, premium],
  );

  const { fiatPrice: fiatPriceHigh } = useBitcoinPrices(buyAmountRangeHigh);
  const priceHighWithPremium = useMemo(
    () => round(fiatPriceHigh * (1 + premium / CENT), 2),
    [fiatPriceHigh, premium],
  );

  return (
    <PeachText style={tw`text-center body-s`}>
      {i18n(
        "offerPreferences.currentPrice",
        `${priceLowWithPremium} - ${priceHighWithPremium} ${displayCurrency}`,
      )}
    </PeachText>
  );
}

const MIN_PREMIUM_INCREMENT = 0.01;
function BuyPremiumInput() {
  const preferences = useOfferPreferences(
    (state) => ({
      maxPremium: state.premium - MIN_PREMIUM_INCREMENT,
      meansOfPayment: state.meansOfPayment,
    }),
    shallow,
  );

  const { data } = useFilteredMarketStats({ type: "bid", ...preferences });

  return (
    <View style={tw`items-center self-stretch gap-10px`}>
      <PremiumInputComponent />
      <CurrentPrice />
      <PeachText style={tw`text-success-dark-2`}>
        {i18n(
          "offerPreferences.competingBuyOffersBelowThisPremium",
          String(data.offersWithinRange.length),
        )}
      </PeachText>
    </View>
  );
}

type SliderProps = {
  setIsSliding: (isSliding: boolean) => void;
  trackWidth: number;
  range: [number, number];
  setRange: (newRange: [number, number]) => void;
};
function AmountSliders({
  setIsSliding,
  trackWidth,
  range: [min, max],
  setRange,
}: SliderProps) {
  const [, maxLimit] = useTradingAmountLimits("buy");
  const trackMax = trackWidth - sliderWidth;
  const trackDelta = trackMax - trackMin;

  const getAmountInBounds = useAmountInBounds(trackWidth, "buy");

  const maxTranslateX = (max / maxLimit) * trackDelta;
  const minTranslateX = (min / maxLimit) * trackDelta;

  const sliderDelta = maxTranslateX - minTranslateX;
  const minSliderDeltaAsAmount = useMinSliderDeltaAsAmount(trackWidth);
  const onDrag =
    (type: "min" | "max") =>
    ({ nativeEvent: { pageX } }: GestureResponderEvent) => {
      const bounds =
        type === "min"
          ? ([trackMin, trackMax - sliderWidth] as const)
          : ([trackMin + sliderWidth, trackMax] as const);
      const newAmount = getAmountInBounds(pageX, bounds);
      if (type === "min") {
        const newMaxAmount = Math.max(newAmount + minSliderDeltaAsAmount, max);
        setRange([newAmount, newMaxAmount]);
      } else {
        const newMinAmount = Math.min(newAmount - minSliderDeltaAsAmount, min);
        setRange([newMinAmount, newAmount]);
      }
    };

  return (
    <>
      <Slider
        trackWidth={trackWidth}
        setIsSliding={setIsSliding}
        onDrag={onDrag("min")}
        hitSlop={{
          bottom: sectionContainerGap,
          left: trackWidth,
          right: sliderDelta / 2 + sliderWidth,
        }}
        type="buy"
        transform={[{ translateX: minTranslateX }]}
        iconId="chevronsUp"
      />
      <Slider
        trackWidth={trackWidth}
        setIsSliding={setIsSliding}
        onDrag={onDrag("max")}
        hitSlop={{
          bottom: sectionContainerGap,
          left: sliderDelta / 2 - sliderWidth,
          right: trackWidth,
        }}
        type="buy"
        transform={[{ translateX: maxTranslateX }]}
        iconId="chevronsUp"
      />
    </>
  );
}
type AmountInputProps = {
  minAmountDelta: number;
  type: "min" | "max";
  range: [number, number];
  setRange: (newRange: [number, number]) => void;
};
function BuyAmountInput({
  minAmountDelta,
  type,
  range: [min, max],
  setRange,
}: AmountInputProps) {
  const inputRef = useRef<TextInput>(null);
  const amount = type === "min" ? min : max;

  const [inputValue, setInputValue] = useState(String(amount));
  const restrictAmount = useRestrictSatsAmount("buy");

  const onFocus = () => setInputValue("0");

  const onChangeText = (value: string) =>
    setInputValue(enforceDigitFormat(value));

  const getNewRange = (newAmount: number): [number, number] => {
    if (type === "min") {
      const newMax = restrictAmount(Math.max(max, newAmount + minAmountDelta));
      const newMin = Math.min(newAmount, newMax - minAmountDelta);
      return [newMin, newMax];
    }
    const newMin = restrictAmount(Math.min(min, newAmount - minAmountDelta));
    const newMax = Math.max(newAmount, newMin + minAmountDelta);
    return [newMin, newMax];
  };
  const onEndEditing = ({
    nativeEvent: { text },
  }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const newAmount = restrictAmount(Number(enforceDigitFormat(text)));
    const newRange = getNewRange(newAmount);
    setRange(newRange);
    setInputValue(String(newAmount));
  };

  const displayValue = inputRef.current?.isFocused()
    ? inputValue
    : String(amount);

  return (
    <View style={tw`self-stretch justify-center`}>
      <SatsInputComponent
        ref={inputRef}
        value={displayValue}
        onFocus={onFocus}
        onEndEditing={onEndEditing}
        onChangeText={onChangeText}
      />
    </View>
  );
}

function FiatPriceRange({ range: [min, max] }: { range: [number, number] }) {
  const { fiatPrice: minFiatPrice } = useBitcoinPrices(min);
  const { fiatPrice: maxFiatPrice } = useBitcoinPrices(max);

  return (
    <View style={tw`z-10 flex-row self-stretch justify-between`}>
      <PeachText style={tw`leading-loose text-center grow subtitle-0`}>
        {minFiatPrice} - {maxFiatPrice}
      </PeachText>
      <DisplayCurrencySelector />
    </View>
  );
}

function useMinSliderDeltaAsAmount(trackWidth: number) {
  const [minLimit, maxLimit] = useTradingAmountLimits("buy");

  const trackDelta = trackWidth - sliderWidth - trackMin;
  const minSliderDeltaAsAmount =
    (sliderWidth / trackDelta) * (maxLimit - minLimit);
  return minSliderDeltaAsAmount;
}
