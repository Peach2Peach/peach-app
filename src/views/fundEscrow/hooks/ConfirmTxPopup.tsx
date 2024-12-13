import { View } from "react-native";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { ShortBitcoinAddress } from "../../../components/bitcoin/ShortBitcoinAddress";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { thousands } from "../../../utils/string/thousands";

type Props = {
  amount: number;
  address: string;
  fee: number;
  feeRate: number;
  text: string;
  secondText?: string;
};

export function ConfirmTxPopup({
  amount,
  address,
  fee,
  feeRate,
  text,
  secondText,
}: Props) {
  return (
    <View style={tw`gap-3`}>
      <PeachText style={tw`text-black-100`}>{text}</PeachText>
      <BTCAmount amount={amount} size="medium" textStyle={tw`text-black-100`} />
      {!!secondText && (
        <PeachText style={tw`text-black-100`}>{secondText}</PeachText>
      )}
      <PeachText style={tw`text-black-100`}>
        {i18n("transaction.details.to")}{" "}
        <ShortBitcoinAddress address={address} />
      </PeachText>
      <PeachText style={tw`text-black-100`}>
        {i18n(
          "transaction.details.networkFee",
          thousands(fee),
          thousands(feeRate)
        )}
      </PeachText>
    </View>
  );
}
