import { View } from "react-native";
import { PeachText } from "../../../../components/text/PeachText";
import tw from "../../../../styles/tailwind";
import i18n from "../../../../utils/i18n";
import { round } from "../../../../utils/math/round";

type Props = {
  label: string;
  fee: number;
  isError?: boolean;
};

export const FeeInfo = ({ label, fee, isError }: Props) => (
  <View>
    <PeachText style={tw`text-center text-black-50`}>{label}</PeachText>
    <PeachText
      style={[tw`text-center subtitle-1`, isError && tw`text-primary-main`]}
    >
      {round(fee, 2)} {i18n("satPerByte")}
    </PeachText>
  </View>
);
