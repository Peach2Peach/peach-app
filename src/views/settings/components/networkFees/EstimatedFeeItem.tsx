import { useTranslate } from "@tolgee/react";
import { View } from "react-native";
import { PeachText } from "../../../../components/text/PeachText";
import tw from "../../../../styles/tailwind";

type Props = {
  feeRate: Exclude<FeeRate, number | "economyFee">;
  estimatedFees: number;
};
export const EstimatedFeeItem = ({ feeRate, estimatedFees }: Props) => {
  const { t } = useTranslate("settings");

  return (
    <View>
      <PeachText style={tw`py-1 subtitle-1 leading-base`}>
        {t(`settings.networkFees.estimatedTime.${feeRate}`)}
        <PeachText style={tw`text-black-65 ml-0.5`}>
           (
          {t("settings.networkFees.xSatsPerByte", {
            fees: estimatedFees.toString(),
          })}
          )
        </PeachText>
      </PeachText>
    </View>
  );
};
