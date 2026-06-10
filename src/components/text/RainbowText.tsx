import { useEffect } from "react";
import { StyleProp, TextStyle } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// shimmer within the app's orange family — deep burnt → main → light amber
// (last stop === first stop for a seamless cycle)
const COLORS = [
  "#963600",
  "#C45104",
  "#F56522",
  "#FF7A50",
  "#FFA24C",
  "#FFA171",
  "#963600",
];
const INPUT = COLORS.map((_, i) => i / (COLORS.length - 1));

// how far each successive character is shifted along the rainbow
const CHAR_SHIFT = 0.07;
// full loop duration in ms
const LOOP_MS = 2200;

function RainbowChar({
  char,
  index,
  progress,
  style,
}: {
  char: string;
  index: number;
  progress: SharedValue<number>;
  style?: StyleProp<TextStyle>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    const t = (progress.value + index * CHAR_SHIFT) % 1;
    return { color: interpolateColor(t, INPUT, COLORS) };
  });

  return (
    <Animated.Text
      allowFontScaling={false}
      style={[style, animatedStyle]}
      // a plain space can collapse on Android, keep it non-breaking
    >
      {char === " " ? " " : char}
    </Animated.Text>
  );
}

export const RainbowText = ({
  text,
  style,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: LOOP_MS, easing: Easing.linear }),
      -1,
      false,
    );
  }, [progress]);

  return (
    <Animated.Text allowFontScaling={false} style={style}>
      {[...text].map((char, index) => (
        <RainbowChar
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          char={char}
          index={index}
          progress={progress}
          style={style}
        />
      ))}
    </Animated.Text>
  );
};
