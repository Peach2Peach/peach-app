import { View } from "react-native";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type Props = {
  text: string;
};

export function InfoFrame({ text }: Props) {
  return (
    <View
      style={tw`items-center px-4 border-2 rounded-lg py-10px border-info-light gap-10px max-w-230px`}
    >
      <View
        style={tw`absolute py-2px -left-3 top-8px bg-primary-background-light`}
      >
        <Icon size={20} id="info" color={tw.color("info-main")} />
      </View>
      <PeachText>{text}</PeachText>
    </View>
  );
}
