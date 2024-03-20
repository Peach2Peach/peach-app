import { View } from "react-native";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { ShortBitcoinAddress } from "../../../components/bitcoin/ShortBitcoinAddress";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import { thousands } from "../../../utils/string/thousands";
import { useTranslate } from "@tolgee/react";

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
  const { t } = useTranslate("wallet");
  return (
    <View style={tw`gap-3`}>
      <PeachText>{text}</PeachText>
      <BTCAmount amount={amount} size="medium" />
      {!!secondText && <PeachText>{secondText}</PeachText>}
      <PeachText>
        {t("transaction.details.to")} <ShortBitcoinAddress address={address} />
      </PeachText>
      <PeachText>
        {t("transaction.details.networkFee", {
          fees: thousands(fee),
          feeRate: thousands(feeRate),
        })}
      </PeachText>
    </View>
  );
}
