import { Animated } from "react-native";

export const getTransform = (pan: Animated.Value, widthToSlide: number) => [
  {
    translateX: pan.interpolate({
      inputRange: [0, 1],
      outputRange: [0, widthToSlide],
      extrapolate: "clamp",
    }),
  },
];
