import { forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import { BTCAmountInput } from "../../../components/inputs/BTCAmountInput";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import { inputContainerStyle } from "../Sell";

export const textStyle =
  "text-center subtitle-0 leading-relaxed py-1px text-black-100 android:h-7";

export const SatsInputComponent = forwardRef<TextInput, TextInputProps>(
  (props, ref) => {
    const { isDarkMode } = useThemeStore();

    return (
      <BTCAmountInput
        {...props}
        ref={ref}
        size="large"
        containerStyle={[
          tw.style(inputContainerStyle),
          tw.style(!isDarkMode ? "bg-primary-background-light" : ""),
          tw`py-9px`,
        ]}
        textStyle={[
          tw.style(
            `text-center subtitle-0 leading-relaxed py-1px ${isDarkMode ? "text-backgroundLight" : "text-black-100"} android:h-7`,
          ),
          tw`absolute w-full opacity-0`,
        ]}
      />
    );
  },
);
