import { forwardRef } from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { BTCAmount, BTCAmountProps } from "../bitcoin/BTCAmount";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: BTCAmountProps["size"];
} & TextInputProps;

export const BTCAmountInput = forwardRef<TextInput, Props>(
  ({ containerStyle, textStyle, size = "small", ...props }, ref) => {
    const { isDarkMode } = useThemeStore();

    return (
      <View
        style={[
          containerStyle,
          isDarkMode && tw`bg-transparent`,
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
                ? "rgba(0, 0, 0, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
              color: isDarkMode ? "white" : "black",
            },
          ]}
          keyboardType="number-pad"
        />
      </View>
    );
  },
);
