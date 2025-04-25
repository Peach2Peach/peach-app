import { View } from "react-native";
import tw from "../../styles/tailwind";
import { PeachText } from "../text/PeachText";

export type SummaryItemProps = {
  children: React.ReactNode;
  title: string;
};
export const SummaryItem = ({ title, children }: SummaryItemProps) => (
  <View style={tw`flex-row flex-wrap justify-between max-w-full`}>
    <PeachText style={[tw`text-black-50`, tw`md:body-l`]}>{title}</PeachText>
    <View>{children}</View>
  </View>
);
