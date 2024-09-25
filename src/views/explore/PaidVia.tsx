import { View } from "react-native";
import { NewBubble } from "../../components/bubble/Bubble";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";

export function PaidVia({ paymentMethod }: { paymentMethod: PaymentMethod }) {
  return (
    <View style={tw`flex-row items-center self-stretch justify-between px-3`}>
      <PeachText>paid via</PeachText>
      <NewBubble color="black" ghost>
        {paymentMethod}
      </NewBubble>
    </View>
  );
}
