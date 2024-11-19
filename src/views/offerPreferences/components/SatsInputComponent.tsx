import { forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import { BTCAmountInput } from "../../../components/inputs/BTCAmountInput";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import { inputContainerStyle } from "../SellOfferPreferences";

export const textStyle =
  "text-center subtitle-1 leading-relaxed py-1px text-black-100 android:h-7";

export const SatsInputComponent = forwardRef<TextInput, TextInputProps>(
  (props, ref) => {
    const { isDarkMode } = useThemeStore();

    return (
      <BTCAmountInput
        {...props}
        ref={ref}
        containerStyle={[
          tw.style(inputContainerStyle),
          tw`py-2`,
          isDarkMode && tw`bg-transparent`,
        ]}
        textStyle={[
          tw.style(
            `text-center subtitle-1 leading-relaxed py-1px ${isDarkMode ? "text-backgroundLight-light" : "text-black-100"}`,
          ),
          tw`absolute w-full opacity-0`,
        ]}
      />
    );
  },
);
