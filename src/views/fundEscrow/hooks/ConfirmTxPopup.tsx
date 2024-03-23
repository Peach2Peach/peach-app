import { View } from "react-native";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { ShortBitcoinAddress } from "../../../components/bitcoin/ShortBitcoinAddress";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import { getAddressChain } from "../../../utils/blockchain/getAddressChain";
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
  const chain = getAddressChain(address);
  return (
    <View style={tw`gap-3`}>
      <PeachText>{text}</PeachText>
      <BTCAmount chain={chain} amount={amount} size="medium" />
      {!!secondText && <PeachText>{secondText}</PeachText>}
      <PeachText>
        {i18n("transaction.details.to")}{" "}
        <ShortBitcoinAddress address={address} />
      </PeachText>
      <PeachText>
        {i18n(
          "transaction.details.networkFee",
          thousands(fee),
          thousands(feeRate),
        )}
      </PeachText>
    </View>
  );
}
