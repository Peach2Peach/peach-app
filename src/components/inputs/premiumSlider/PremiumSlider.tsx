import { ReactNode, useMemo } from "react";
import { Animated, View } from "react-native";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { getTranslateX } from "../../../utils/layout/getTranslateX";
import { round } from "../../../utils/math/round";
import { Icon } from "../../Icon";
import { PeachText } from "../../text/PeachText";
import { usePremiumSliderSetup } from "./usePremiumSliderSetup";

const onStartShouldSetResponder = () => true;

type Props = {
  premium: number;
  setPremium: (newPremium: number, isValid?: boolean | undefined) => void;
};

const LABEL_AMOUNT = 5;
export const PremiumSlider = ({ premium, setPremium }: Props) => {
  const { pan, panResponder, onLayout, trackWidth, knobWidth, min, max } =
    usePremiumSliderSetup(premium, setPremium);
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
      style={tw`items-center self-stretch gap-6px`}
      {...panResponder.panHandlers}
      {...{ onStartShouldSetResponder }}
    >
      <View
        style={[
          tw`w-full h-8`,
          tw`border p-0.5 rounded-full border-primary-mild-1 justify-center`,
          isDarkMode ? tw`bg-transparent` : tw`bg-primary-background-dark`,
        ]}
      >
        {labelPosition.map((position) => (
          <View
            key={position}
            style={[
              tw`absolute items-center justify-center w-full top-3 bottom-3`,
              { left: position },
            ]}
          >
            <View style={tw`w-[2px] h-full bg-primary-mild-1`} />
          </View>
        ))}
        <View {...{ onLayout }}>
          <Animated.View
            style={[
              { width: knobWidth },
              tw`z-10 items-center justify-center h-full rounded-full bg-primary-main`,
              getTranslateX(pan, [0, trackWidth]),
            ]}
          >
            <Icon
              id="chevronsDown"
              style={tw`w-4`}
              color={tw.color("primary-background-light")}
            />
          </Animated.View>
        </View>
      </View>
      <View style={tw`w-full h-10 mt-1`}>
        <SliderLabel position={labelPosition[0]}>{min}%</SliderLabel>
        <SliderLabel position={labelPosition[1]}>
          {round(min / 2, -1)}%
        </SliderLabel>
        <SliderLabel position={labelPosition[2]}>
          {i18n("sell.premium.marketPrice")}
        </SliderLabel>
        <SliderLabel position={labelPosition[3]}>
          +{round(max / 2, -1)}%
        </SliderLabel>
        <SliderLabel position={labelPosition[4]}>+{max}%</SliderLabel>
      </View>
    </View>
  );
};

type SliderLabelProps = { position: number; children: ReactNode };

function SliderLabel({ position, children }: SliderLabelProps) {
  return (
    <View style={[tw`absolute items-center w-full`, { left: position }]}>
      <PeachText
        style={tw`mt-1 leading-tight text-center subtitle-2 text-black-50 max-w-20`}
      >
        {children}
      </PeachText>
    </View>
  );
}
