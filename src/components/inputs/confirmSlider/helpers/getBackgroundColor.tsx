import { Animated } from "react-native";
import tw from "../../../../styles/tailwind";

export const EIGHTY_PERCENT = 0.8;

export const getBackgroundColor = (pan: Animated.Value) =>
  pan.interpolate({
    inputRange: [0, EIGHTY_PERCENT, 1],
    outputRange: [
      tw.color("primary-main") || "#F56522",
      tw.color("primary-main") || "#F56522",
      tw.color("success-main") || "65A519",
    ],
  });
