import { View } from "react-native";
import { PeachText } from "../../../../components/text/PeachText";
import tw from "../../../../styles/tailwind";
import { round } from "../../../../utils/math/round";
import { tolgee } from "../../../../tolgee";

type Props = {
  label: string;
  fee: number;
  isError?: boolean;
};

export const FeeInfo = ({ label, fee, isError }: Props) => (
  <View>
    <PeachText style={tw`text-center text-black-65`}>{label}</PeachText>
    <PeachText
      style={[tw`text-center subtitle-1`, isError && tw`text-primary-main`]}
    >
      {round(fee, 2)} {tolgee.t("satPerByte", { ns: "global" })}
    </PeachText>
  </View>
);
