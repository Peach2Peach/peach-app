import { View } from "react-native";
import { PeachText } from "../../../../components/text/PeachText";
import tw from "../../../../styles/tailwind";
import { tolgee } from "../../../../tolgee";

type Props = {
  feeRate: FeeRate;
  estimatedFees: number;
};
export const EstimatedFeeItem = ({ feeRate, estimatedFees }: Props) => (
  <View>
    <PeachText style={tw`py-1 subtitle-1 leading-base`}>
      {tolgee.t(`settings.networkFees.estimatedTime.${feeRate}`, {
        ns: "settings",
      })}
      <PeachText style={tw`text-black-65 ml-0.5`}>
         (
        {tolgee.t("settings.networkFees.xSatsPerByte", {
          ns: "settings",
          fees: estimatedFees.toString(),
        })}
        )
      </PeachText>
    </PeachText>
  </View>
);
