import { Animated } from "react-native";

export const getTranslateX = (
  pan: Animated.Value,
  range: [number, number],
) => ({
  transform: [
    {
      translateX: pan.interpolate({
        inputRange: range,
        outputRange: range,
        extrapolate: "clamp",
      }),
    },
  ],
});
