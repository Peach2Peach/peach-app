import { useMemo } from "react";
import { Animated, View } from "react-native";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n, { useI18n } from "../../../utils/i18n";
import { getTranslateX } from "../../../utils/layout/getTranslateX";
import { round } from "../../../utils/math/round";
import { Icon } from "../../Icon";
import { PeachText } from "../../text/PeachText";
import { SliderLabel } from "./SliderLabel";
import { SliderMarkers } from "./SliderMarkers";
import { usePremiumSliderSetup } from "./usePremiumSliderSetup";

const onStartShouldSetResponder = () => true;

type Props = {
  premium: number;
  setPremium: (newPremium: number, isValid?: boolean | undefined) => void;
  green?: boolean;
  currentCHFPrice: number;
  currentAmount: number;
} & ComponentProps;

const LABEL_AMOUNT = 5;
export const PremiumSlider = ({
  style,
  premium,
  setPremium,
  green = false,
  currentCHFPrice,
  currentAmount,
}: Props) => {
  useI18n();
  const {
    pan,
    panResponder,
    onLayout,
    trackWidth,
    knobWidth,
    min,
    max,
    sliderMin,
    sliderMax,
  } = usePremiumSliderSetup(premium, setPremium, currentCHFPrice, currentAmount);
  const { isDarkMode } = useThemeStore();

  const labelPosition = useMemo(
    () =>
      [...Array(LABEL_AMOUNT)].map(
        (_position, index) =>
          round((index / (LABEL_AMOUNT - 1)) * trackWidth) - trackWidth / 2,
      ),
    [trackWidth],
  );

  return (
    <View
      style={style}
      {...panResponder.panHandlers}
      {...{ onStartShouldSetResponder }}
    >
      <View
        style={[
          tw`w-full h-8`,
          tw`border p-0.5 rounded-full justify-center`,
          green ? tw`border-success-mild-2` : tw`border-primary-mild-1`,
          isDarkMode
            ? tw`bg-transparent`
            : green
              ? tw`bg-success-background-dark-color`
              : tw`bg-primary-background-dark-color`,
        ]}
      >
        <SliderMarkers positions={labelPosition} green={green} />
        <View {...{ onLayout }}>
          <Animated.View
            style={[
              { width: knobWidth },
              tw`z-10 items-center justify-center h-full rounded-full ${green ? "bg-success-main" : "bg-primary-main"}`,
              getTranslateX(pan, [0, trackWidth]),
            ]}
          >
            <Icon
              id="chevronsDown"
              style={tw`w-4`}
              color={tw.color("primary-background-light-color")}
            />
          </Animated.View>
        </View>
      </View>
      <View style={tw`w-full h-10 mt-1`}>
        <SliderLabel position={labelPosition[0]}>{sliderMin}%</SliderLabel>
        <SliderLabel position={labelPosition[1]}>
          {round(sliderMin / 2, -1)}%
        </SliderLabel>
        <SliderLabel position={labelPosition[2]}>
          {i18n("sell.premium.marketPrice")}
        </SliderLabel>
        <SliderLabel position={labelPosition[3]}>
          +{round(sliderMax / 2, -1)}%
        </SliderLabel>
        <SliderLabel position={labelPosition[4]}>+{sliderMax}%</SliderLabel>
      </View>
      <PeachText
        style={[
          tw`text-center text-black-50 body-s mt-1`,
          (premium <= sliderMin && min < sliderMin) ||
          (premium >= sliderMax && max > sliderMax)
            ? tw`opacity-100`
            : tw`opacity-0`,
        ]}
      >
        {i18n("sell.premium.slider.useButtons")}
      </PeachText>
    </View>
  );
};
