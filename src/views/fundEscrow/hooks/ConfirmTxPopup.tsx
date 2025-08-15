import { Fragment } from "react";
import { View } from "react-native";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { ShortBitcoinAddress } from "../../../components/bitcoin/ShortBitcoinAddress";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { thousands } from "../../../utils/string/thousands";

type Props = {
  totalAmount: number;
  fee: number;
  feeRate: number;
  text: string;
  secondText?: string;
  outputs: { address: string; amount: number }[];
};

export function ConfirmTxPopup({
  totalAmount,
  fee,
  feeRate,
  text,
  secondText,
  outputs,
}: Props) {
  return (
    <View style={tw`gap-3`}>
      <PeachText style={tw`text-black-100`}>{text}</PeachText>
      {outputs.length > 1 && (
        <View style={tw`flex-row items-center`}>
          <PeachText style={tw`text-black-100`}>
            {`${i18n("transaction.details.total")}: `}
          </PeachText>
          <BTCAmount amount={totalAmount} size="medium" />
        </View>
      )}
      {outputs.map((output, index) => (
        <Fragment key={`transaction-output-${index}`}>
          <BTCAmount
            amount={output.amount}
            size="medium"
            textStyle={tw`text-black-100`}
          />
          <PeachText style={tw`text-black-100`}>
            {i18n("transaction.details.to")}{" "}
            <ShortBitcoinAddress address={output.address} />
          </PeachText>
        </Fragment>
      ))}
      {!!secondText && (
        <PeachText style={tw`text-black-100`}>{secondText}</PeachText>
      )}
      <PeachText style={tw`text-black-100`}>
        {i18n(
          "transaction.details.networkFee",
          thousands(fee),
          thousands(feeRate),
        )}
      </PeachText>
    </View>
  );
}
