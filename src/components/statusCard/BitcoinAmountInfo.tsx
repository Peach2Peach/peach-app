import { View } from "react-native";
import tw from "../../styles/tailwind";
import { BTCAmount } from "../bitcoin/BTCAmount";
import { FixedHeightText } from "../text/FixedHeightText";
import { infoContainerStyle } from "./infoContainerStyle";
import { useTranslate } from "@tolgee/react";

export function BitcoinAmountInfo({
  amount,
  premium,
}: {
  amount: number;
  premium?: number;
}) {
  const { t } = useTranslate("offer");

  return (
    <View style={[infoContainerStyle, tw`gap-6px`]}>
      <BTCAmount size="small" amount={amount} />
      {premium !== undefined && (
        <FixedHeightText style={tw`body-m text-black-65`} height={17}>
          {premium}% {t("offer.summary.premium")}
        </FixedHeightText>
      )}
    </View>
  );
}
