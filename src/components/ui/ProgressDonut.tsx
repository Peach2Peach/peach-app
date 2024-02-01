import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { Circle, G, Svg } from "react-native-svg";
import tw from "../../styles/tailwind";
import { PeachText } from "../text/PeachText";

type Props = ComponentProps & {
  title: string;
  max: number;
  value: number;
};
export const ProgressDonut = ({ title, max, value, style }: Props) => {
  const percent = value / max;

  const strokeWidth = 6;
  const diameter = 32;
  const radius = (diameter - strokeWidth) / 2;
  const circleCircumference = 2 * Math.PI * radius;
  const strokeDashOffsetAnim = useRef(
    new Animated.Value(circleCircumference),
  ).current;
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  useEffect(() => {
    Animated.timing(strokeDashOffsetAnim, {
      toValue: circleCircumference - circleCircumference * percent,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [circleCircumference, percent, strokeDashOffsetAnim]);

  return (
    <View style={[tw`items-center`, style]}>
      <PeachText
        style={[
          tw`font-bold text-center text-primary-main text-3xs`,
          tw`md:text-xs`,
        ]}
      >
        {title}
      </PeachText>
      <View style={[tw`w-8 h-8`, tw`md:w-10 md:h-10`]}>
        <Svg style={tw`w-full h-full`} viewBox="0 0 32 32">
          <G rotation={-90} originX="16" originY="16">
            <Circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="transparent"
              stroke={tw.color("primary-background-dark")}
              strokeWidth={strokeWidth}
            />
            <AnimatedCircle
              cx="50%"
              cy="50%"
              r={radius}
              fill="transparent"
              stroke={tw.color("primary-main")}
              strokeWidth={strokeWidth}
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashOffsetAnim}
            />
          </G>
        </Svg>
        <View style={tw`absolute items-center justify-center w-full h-full`}>
          <PeachText
            style={[tw`font-bold text-3xs`, tw`md:text-base`, tw`ios:mt-0.5`]}
          >
            {value}
          </PeachText>
        </View>
      </View>
    </View>
  );
};
