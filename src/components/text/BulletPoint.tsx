import { View } from "react-native";
import tw from "../../styles/tailwind";
import { PeachText } from "./PeachText";

type Props = { text: string };

export const BulletPoint = ({ text }: Props) => (
  <View style={tw`flex-row`}>
    <PeachText>{"\u2022"}</PeachText>
    <PeachText style={tw`pl-3`}>{text}</PeachText>
  </View>
);
