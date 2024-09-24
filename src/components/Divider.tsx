import { View } from "react-native";
import tw from "../styles/tailwind";
import { PeachText } from "./text/PeachText";
import { HorizontalLine } from "./ui/HorizontalLine";

type Props = {
  text?: string;
  icon?: JSX.Element;
};

export const Divider = ({ icon, text }: Props) => (
  <View style={tw`flex-row items-center`}>
    {!!icon && icon}
    {!!text && (
      <PeachText
        style={[tw`mr-2 text-black-65`, tw`md:body-l md:leading-normal`]}
      >
        {text}
      </PeachText>
    )}
    <HorizontalLine style={tw`grow`} />
  </View>
);
