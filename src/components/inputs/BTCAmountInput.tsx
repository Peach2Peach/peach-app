import { forwardRef } from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { useThemeStore } from "../../store/theme"; // Import theme store
import tw from "../../styles/tailwind";
import { BTCAmount, BTCAmountProps } from "../bitcoin/BTCAmount";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: BTCAmountProps["size"];
} & TextInputProps;

export const BTCAmountInput = forwardRef<TextInput, Props>(
  ({ containerStyle, textStyle, size = "small", ...props }, ref) => {
    const { isDarkMode } = useThemeStore(); // Access dark mode state

    return (
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
          style={[
            textStyle,
            {
              backgroundColor: isDarkMode
                ? "rgba(0, 0, 0, 0.8)" // Dark mode background color
                : "rgba(255, 255, 255, 0.8)", // Light mode background color
              color: isDarkMode ? "white" : "black", // Adjust text color for visibility
            },
          ]}
          keyboardType="number-pad"
        />
      </View>
    );
  },
);
