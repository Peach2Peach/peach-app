import { View } from "react-native";
import tw from "../../styles/tailwind";
import { BTCAmount } from "../bitcoin/BTCAmount";
import { FixedHeightText } from "../text/FixedHeightText";
import { infoContainerStyle } from "./infoContainerStyle";
import { tolgee } from "../../tolgee";

export function BitcoinAmountInfo({
  amount,
  premium,
}: {
  amount: number;
  premium?: number;
}) {
  return (
    <View style={[infoContainerStyle, tw`gap-6px`]}>
      <BTCAmount size="small" amount={amount} />
      {premium !== undefined && (
        <FixedHeightText style={tw`body-m text-black-65`} height={17}>
          {premium}% {tolgee.t("offer.summary.premium", { ns: "offer" })}
        </FixedHeightText>
      )}
    </View>
  );
}
