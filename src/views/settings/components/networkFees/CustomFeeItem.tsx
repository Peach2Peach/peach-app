import { Dispatch } from "react";
import { TextInput, View } from "react-native";
import { PeachText } from "../../../../components/text/PeachText";
import { useThemeStore } from "../../../../store/theme";
import tw from "../../../../styles/tailwind";
import { enforceDecimalsFormat } from "../../../../utils/format/enforceDecimalsFormat";
import i18n from "../../../../utils/i18n";

type Props = {
  customFeeRate?: string;
  setCustomFeeRate: Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
};

export const CustomFeeItem = ({
  customFeeRate,
  setCustomFeeRate,
  disabled,
}: Props) => {
  const { isDarkMode } = useThemeStore();

  return (
    <View style={tw`flex-row items-center gap-2`}>
      <PeachText style={tw`subtitle-1 leading-base`}>
        {i18n("settings.networkFees.custom")}:
      </PeachText>
      <View
        style={tw.style(
          "flex-row items-center w-16 h-8 py-3 overflow-hidden rounded-xl border border-black-65",
          isDarkMode
            ? "bg-transparent border border-primary-background-light-color"
            : "bg-primary-background-light-color"
        )}
      >
        <TextInput
          value={customFeeRate}
          onChangeText={(text) =>
            setCustomFeeRate(enforceDecimalsFormat(text, 2))
          }
          style={tw.style(
            "h-8 py-0 text-center grow input-text",
            isDarkMode ? "text-backgroundLight-light" : "text-black-65"
          )}
          keyboardType={"decimal-pad"}
          editable={!disabled}
          testID="input-custom-fees"
        />
      </View>
      <PeachText style={tw`text-black-65`}>{i18n("satsPerByte")}</PeachText>
    </View>
  );
};

export default CustomFeeItem;
