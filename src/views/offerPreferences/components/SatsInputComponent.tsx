import { forwardRef } from "react";
import { TextInput, TextInputProps } from "react-native";
import { BTCAmountInput } from "../../../components/inputs/BTCAmountInput";
import tw from "../../../styles/tailwind";
import { inputContainerStyle } from "../Sell";

export const textStyle =
  "text-center subtitle-0 leading-relaxed py-1px text-black-100 android:h-7";

export const SatsInputComponent = forwardRef<TextInput, TextInputProps>(
  (props, ref) => (
    <BTCAmountInput
      {...props}
      ref={ref}
      size="large"
      containerStyle={[tw.style(inputContainerStyle), tw`py-9px`]}
      textStyle={[tw.style(textStyle), tw`absolute w-full opacity-0`]}
    />
  ),
);
