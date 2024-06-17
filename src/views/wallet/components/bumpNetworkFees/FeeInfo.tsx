import { View } from "react-native";
import { PeachText } from "../../../../components/text/PeachText";
import tw from "../../../../styles/tailwind";
import { round } from "../../../../utils/math/round";
import { useTranslate } from "@tolgee/react";

type Props = {
  label: string;
  fee: number;
  isError?: boolean;
};

export const FeeInfo = ({ label, fee, isError }: Props) => {
  const { t } = useTranslate("global");

  return (
    <View>
      <PeachText style={tw`text-center text-black-65`}>{label}</PeachText>
      <PeachText
        style={[tw`text-center subtitle-1`, isError && tw`text-primary-main`]}
      >
        {round(fee, 2)} {t("satPerByte")}
      </PeachText>
    </View>
  );
};
