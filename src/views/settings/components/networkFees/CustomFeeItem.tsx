import { Dispatch } from "react";
import { TextInput, View } from "react-native";
import { PeachText } from "../../../../components/text/PeachText";
import tw from "../../../../styles/tailwind";
import { enforceDecimalsFormat } from "../../../../utils/format/enforceDecimalsFormat";
import i18n from "../../../../utils/i18n";

type Props = {
  customFeeRate?: string;
  setCustomFeeRate: Dispatch<string>;
  disabled?: boolean;
  chain: Chain;
};

export const CustomFeeItem = ({
  customFeeRate,
  setCustomFeeRate,
  disabled,
  chain,
}: Props) => {
  const bgColor =
    chain === "liquid"
      ? tw`bg-liquid-secondary`
      : tw`bg-primary-background-light`;
  return (
    <View style={tw`flex-row items-center gap-2`}>
      <PeachText style={tw`subtitle-1 leading-base`}>
        {i18n("settings.networkFees.custom")}:
      </PeachText>
      <View
        style={[
          tw`flex-row items-center w-16 h-8 py-3 overflow-hidden rounded-xl`,
          tw`border border-black-65`,
          bgColor,
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
      <PeachText style={tw`text-black-65`}>{i18n("satsPerByte")}</PeachText>
    </View>
  );
};
