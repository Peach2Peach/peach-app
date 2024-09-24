import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import tw from "../../styles/tailwind";

type Props = {
  style?: ViewStyle;
  children?: ReactNode;
};

export const LinedText = ({ style, children }: Props) => (
  <View style={[tw`flex-row items-center justify-center `, style]}>
    <View style={tw`flex-1 h-px mr-2 bg-black-10`} />
    {children}
    <View style={tw`flex-1 h-px ml-2 bg-black-10`} />
  </View>
);
