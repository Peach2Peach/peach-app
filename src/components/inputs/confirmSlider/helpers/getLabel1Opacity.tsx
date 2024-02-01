import { Animated } from "react-native";

export const getLabel1Opacity = (pan: Animated.Value) =>
  pan.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
