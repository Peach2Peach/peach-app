import { View } from "react-native";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { PeachText } from "../../components/text/PeachText";
import { CopyAble } from "../../components/ui/CopyAble";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

export function FundingAmount({ fundingAmount }: { fundingAmount: number }) {
  return (
    <View style={tw`flex-row items-center justify-center gap-6px`}>
      <PeachText style={tw`settings`}>{i18n("sell.escrow.sendSats")}</PeachText>
      <BTCAmount style={tw`-mt-0.5`} amount={fundingAmount} size="large" />
      <CopyAble
        value={String(fundingAmount)}
        textPosition="bottom"
        style={tw`w-5 h-5`}
      />
    </View>
  );
}
