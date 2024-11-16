import { LegacyRef, forwardRef } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { useThemeStore } from "../../store/theme"; // Import theme store to access dark mode state
import tw from "../../styles/tailwind";
import { enforceDecimalsFormat } from "../../utils/format/enforceDecimalsFormat";
import { Icon } from "../Icon";

type Props = Omit<TextInputProps, "onChange"> & {
  onChange: (number: string) => void;
};

export const PercentageInput = forwardRef(
  ({ onChange, ...props }: Props, ref: LegacyRef<TextInput> | undefined) => {
    const { isDarkMode } = useThemeStore(); // Access dark mode state

    return (
      <View
        style={[
          tw`flex-row items-center px-2 py-3 overflow-hidden w-23 h-38px rounded-xl`,
          tw`border`,
          isDarkMode
            ? tw`bg-transparent border-primary-mild-1`
            : tw`bg-primary-background-light-color border-black-65`,
        ]}
      >
        <TextInput
          ref={ref}
          onChangeText={(text) => onChange(enforceDecimalsFormat(text, 2))}
          style={[
            tw`grow py-0 text-center h-38px input-text`,
            isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
          ]}
          keyboardType={"decimal-pad"}
          placeholder={"20.00"}
          placeholderTextColor={tw.color(
            isDarkMode ? "primary-mild-1" : "black-10"
          )}
          {...props}
        />
        <View style={tw`pb-1px`}>
          <Icon
            id="percent"
            size={20}
            color={tw.color(
              isDarkMode ? "primary-mild-1" : "black-100"
            )}
          />
        </View>
      </View>
    );
  }
);
