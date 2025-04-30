import { View, ViewStyle } from "react-native";
import tw from "../../styles/tailwind";
import { PeachText } from "../text/PeachText";

import type { JSX } from "react";

type Props = {
  text: string;
  textStyle?: ViewStyle | ViewStyle[];
  IconComponent?: JSX.Element;
  style?: ViewStyle;
};
export const TradeInfo = ({ text, textStyle, IconComponent, style }: Props) => (
  <View
    style={[tw`flex-row items-center self-stretch justify-center gap-1`, style]}
  >
    <PeachText style={[tw`uppercase button-medium`, textStyle]}>
      {text}
    </PeachText>
    {IconComponent}
  </View>
);
