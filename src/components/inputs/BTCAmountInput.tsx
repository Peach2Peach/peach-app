import { forwardRef } from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import tw from "../../styles/tailwind";
import { BTCAmount, BTCAmountProps } from "../bitcoin/BTCAmount";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: BTCAmountProps["size"];
} & TextInputProps;

export const BTCAmountInput = forwardRef<TextInput, Props>(
  ({ containerStyle, textStyle, size = "small", ...props }, ref) => (
    <View
      style={[
        containerStyle,
        ref &&
          "current" in ref &&
          ref.current?.isFocused() &&
          tw`border-2 border-primary-main`,
      ]}
    >
      <BTCAmount size={size} amount={Number(props.value)} />
      <TextInput
        {...props}
        ref={ref}
        style={textStyle}
        keyboardType="number-pad"
      />
    </View>
  ),
);
