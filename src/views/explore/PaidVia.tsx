import { View } from "react-native";
import { NewBubble } from "../../components/bubble/Bubble";
import { PeachText } from "../../components/text/PeachText";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export function PaidVia({ paymentMethod }: { paymentMethod?: PaymentMethod }) {
  if (!paymentMethod) return null;
  return (
    <View style={tw`flex-row items-center self-stretch justify-between px-3`}>
      <PeachText>{i18n("offer.buy.paidVia")}</PeachText>
      <NewBubble color="black" ghost>
        {paymentMethod}
      </NewBubble>
    </View>
  );
}
