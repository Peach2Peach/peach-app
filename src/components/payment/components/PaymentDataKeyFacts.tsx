import { View } from "react-native";
import tw from "../../../styles/tailwind";
import { PeachText } from "../../text/PeachText";

type Props = {
  paymentData: PaymentData;
};
export const PaymentDataKeyFacts = ({ paymentData }: Props) => (
  <View style={tw`flex-row flex-wrap justify-center`}>
    {(paymentData.currencies || []).map((currency) => (
      <View
        key={`paymentData-${paymentData.id}-currency-${currency}`}
        style={tw`justify-center px-1 mx-1 border rounded-lg border-black-100`}
      >
        <PeachText style={tw`button-medium`}>{currency}</PeachText>
      </View>
    ))}
  </View>
);
