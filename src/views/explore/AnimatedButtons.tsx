import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";

const DOT_DELAY = 200;
const NUMBER_OF_DOTS = 3;
const inputRange = new Array(NUMBER_OF_DOTS + 1)
  .fill(0)
  .map((_, i) => i / NUMBER_OF_DOTS);
export function AnimatedButtons() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: DOT_DELAY * NUMBER_OF_DOTS,
          useNativeDriver: true,
        }),
        Animated.delay(DOT_DELAY),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  const dots = Array.from({ length: NUMBER_OF_DOTS }, (_, index) => (
    <Animated.View
      key={index}
      style={{
        opacity: opacity.interpolate({
          inputRange,
          outputRange: Array.from({ length: NUMBER_OF_DOTS + 1 }, (_e, i) =>
            i > index ? 1 : 0,
          ),
        }),
      }}
    >
      <PeachText style={tw`subtitle-1`}>.</PeachText>
    </Animated.View>
  ));

  return <View style={tw`flex-row items-center justify-center`}>{dots}</View>;
}
