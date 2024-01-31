import { Animated } from "react-native";
import tw from "../../../../styles/tailwind";

export const EIGHTY_PERCENT = 0.8;

export const getBackgroundColor = (pan: Animated.Value) =>
  pan.interpolate({
    inputRange: [0, EIGHTY_PERCENT, 1],
    outputRange: [
      tw.color("primary-main") as string,
      tw.color("primary-main") as string,
      tw.color("success-main") as string,
    ],
  });
