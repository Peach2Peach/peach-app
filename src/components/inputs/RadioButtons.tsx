import { ReactNode } from "react";
import { View } from "react-native";
import tw from "../../styles/tailwind";
import { RadioButtonItem } from "./RadioButtonItem";

export type RadioButtonItem<T> = {
  value: T;
  display: ReactNode;
  disabled?: boolean;
};

export type RadioButtonProps<T> = {
  items: RadioButtonItem<T>[];
  selectedValue?: T;
  onButtonPress: (value: T) => void;
};

export const RadioButtons = <T,>({
  items,
  selectedValue,
  onButtonPress,
}: RadioButtonProps<T>) => (
  <View style={tw`gap-2`}>
    {items.map(({ display, disabled, value }, i) => (
      <RadioButtonItem
        key={i}
        display={display}
        isSelected={value === selectedValue}
        onPress={() => onButtonPress(value)}
        disabled={disabled}
      />
    ))}
  </View>
);
