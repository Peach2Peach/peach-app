import { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";
import tw from "../../styles/tailwind";

type Props = ComponentProps & {
  percent: number;
  text?: string;
  backgroundStyle?: ViewStyle;
  barStyle?: ViewStyle;
};
export const Progress = ({
  percent,
  backgroundStyle,
  barStyle,
  style,
}: Props) => {
  const widthAnim = useRef(new Animated.Value(percent)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percent,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [percent, widthAnim]);

  return (
    <View style={[tw`w-full h-4 overflow-hidden rounded-full`, style]}>
      <View
        style={[tw`absolute w-full h-full rounded-full`, backgroundStyle]}
      />
      <Animated.View
        style={[
          tw`w-full h-full rounded-full`,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
          percent ? barStyle : {},
        ]}
      />
    </View>
  );
};
