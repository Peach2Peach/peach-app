import { useTranslate } from "@tolgee/react";
import { Dispatch } from "react";
import { TextInput, View } from "react-native";
import { PeachText } from "../../../../components/text/PeachText";
import tw from "../../../../styles/tailwind";
import { enforceDecimalsFormat } from "../../../../utils/format/enforceDecimalsFormat";

type Props = {
  customFeeRate?: string;
  setCustomFeeRate: Dispatch<string>;
  disabled?: boolean;
};

export const CustomFeeItem = ({
  customFeeRate,
  setCustomFeeRate,
  disabled,
}: Props) => {
  const { t } = useTranslate("settings");

  return (
    <View style={tw`flex-row items-center gap-2`}>
      <PeachText style={tw`subtitle-1 leading-base`}>
        {t("settings.networkFees.custom")}:
      </PeachText>
      <View
        style={[
          tw`flex-row items-center w-16 h-8 py-3 overflow-hidden rounded-xl`,
          tw`border bg-primary-background-light border-black-65`,
        ]}
      >
        <TextInput
          value={customFeeRate}
          onChangeText={(text) =>
            setCustomFeeRate(enforceDecimalsFormat(text, 2))
          }
          style={tw`h-8 py-0 text-center grow input-text text-black-100`}
          keyboardType={"decimal-pad"}
          editable={!disabled}
          testID="input-custom-fees"
        />
      </View>
      <PeachText style={tw`text-black-65`}>
        {t("satsPerByte", { ns: "global" })}
      </PeachText>
    </View>
  );
};
