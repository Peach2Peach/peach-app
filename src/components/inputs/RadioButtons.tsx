import { ReactNode } from "react";
import { View } from "react-native";
import tw from "../../styles/tailwind";
import { RadioButtonItem } from "./RadioButtonItem";

export type RadioButtonItem<T> = {
  value: T;
  display: ReactNode;
  disabled?: boolean;
};

export type RadioButtonProps<T> = ComponentProps & {
  items: RadioButtonItem<T>[];
  selectedValue?: T;
  onButtonPress: (value: T) => void;
  radioButtonStyle?: ComponentProps["style"];
  radioButtonSelectedStyle?: ComponentProps["style"];
  radioIconColor?: string;
};

export const RadioButtons = <T,>({
  items,
  selectedValue,
  onButtonPress,
  style,
  radioButtonStyle,
  radioButtonSelectedStyle,
  radioIconColor,
}: RadioButtonProps<T>) => (
  <View style={[tw`gap-2`, style]}>
    {items.map(({ display, disabled, value }, i) => (
      <RadioButtonItem
        key={i}
        display={display}
        isSelected={value === selectedValue}
        onPress={() => onButtonPress(value)}
        disabled={disabled}
        style={radioButtonStyle}
        selectedStyle={radioButtonSelectedStyle}
        radioIconColor={radioIconColor}
      />
    ))}
  </View>
);
