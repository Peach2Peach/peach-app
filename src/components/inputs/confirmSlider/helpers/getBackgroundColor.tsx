import { Animated } from "react-native";
import tw from "../../../../styles/tailwind";

export const EIGHTY_PERCENT = 0.8;

export const getBackgroundColor = (pan: Animated.Value, color?: string) =>
  pan.interpolate({
    inputRange: [0, EIGHTY_PERCENT, 1],
    outputRange: [
      color || tw.color("primary-main") || "#F56522",
      color || tw.color("primary-main") || "#F56522",
      tw.color("success-main") || "65A519",
    ],
  });
