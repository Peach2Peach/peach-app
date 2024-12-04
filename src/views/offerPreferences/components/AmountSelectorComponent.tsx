import { useRef, useState } from "react";
import {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInput,
  TextInputEndEditingEventData,
  View,
} from "react-native";
import { Placeholder } from "../../../components/Placeholder";
import { PremiumTextInput } from "../../../components/PremiumTextInput";
import { TouchableIcon } from "../../../components/TouchableIcon";
import { PeachText } from "../../../components/text/PeachText";
import { useBitcoinPrices } from "../../../hooks/useBitcoinPrices";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
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
      style={tw`${isDarkMode ? "bg-card" : "bg-success-mild-1-color"}`}
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
      <PremiumInput />
    </Section.Container>
  );
}

function PremiumInput() {
  const iconColor = tw.color("success-main");
  const [premium, setPremium] = useState(21);
  const handlePremiumChange = (newPremium: number) => {
    setPremium(newPremium);
  };
  const onMinusCirclePress = () => {
    setPremium((prev) => Math.max(0, prev - 1));
  };
  const onPlusCirclePress = () => {
    setPremium((prev) => Math.min(21, prev + 1));
  };
  return (
    <View style={tw`items-center self-stretch gap-10px`}>
      <View style={tw`flex-row items-center self-stretch justify-between`}>
        <TouchableIcon
          id="minusCircle"
          iconColor={iconColor}
          onPress={onMinusCirclePress}
        />
        <View style={tw`flex-row items-center self-stretch gap-10px`}>
          <PeachText>max premium:</PeachText>
          <PremiumTextInput
            premium={premium}
            setPremium={handlePremiumChange}
          />
        </View>
        <TouchableIcon
          id="plusCircle"
          iconColor={iconColor}
          onPress={onPlusCirclePress}
        />
      </View>
      <PeachText>currently 168.45 EUR</PeachText>
      <PeachText style={tw`text-success-dark-2`}>
        x competing buy offers with a higher premium
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
