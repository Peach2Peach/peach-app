import { forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import { BTCAmountInput } from "../../../components/inputs/BTCAmountInput";
import { useThemeStore } from "../../../store/theme"; // Import theme store for dark mode check
import tw from "../../../styles/tailwind";
import { inputContainerStyle } from "../SellOfferPreferences";

export const SatsInputComponent = forwardRef<TextInput, TextInputProps>(
  (props, ref) => {
    const { isDarkMode } = useThemeStore(); // Access dark mode state

    return (
      <BTCAmountInput
        {...props}
        ref={ref}
        containerStyle={[
          tw.style(inputContainerStyle),
          tw`py-2`,
          isDarkMode && tw`bg-transparent`, // Make input background transparent in dark mode
        ]}
        textStyle={[
          tw.style(
            `text-center subtitle-1 leading-relaxed py-1px ${isDarkMode ? "text-backgroundLight-light" : "text-black-100"}`
          ),
          tw`absolute w-full opacity-0`,
        ]}
      />
    );
  }
);
