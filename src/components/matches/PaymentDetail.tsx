import { View } from "react-native";
import tw from "../../styles/tailwind";
import { NewBubble as Bubble } from "../bubble/Bubble";
import { PeachText } from "../text/PeachText";

export function PaymentDetail({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <View style={tw`flex-row justify-between`}>
      <PeachText style={tw`text-black-65`}>{label}</PeachText>
      <Bubble disabled color="black" ghost>
        {value}
      </Bubble>
    </View>
  );
}
