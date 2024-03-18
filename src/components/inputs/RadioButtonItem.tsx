import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type Props = ComponentProps & {
  display: ReactNode;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
  selectedStyle?: ComponentProps["style"];
  radioIconColor?: string;
};
export const RadioButtonItem = ({
  display,
  isSelected,
  disabled,
  onPress,
  style,
  selectedStyle,
  radioIconColor,
}: Props) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      tw`flex-row items-center justify-between w-full gap-2 px-4 py-2 border-2 bg-primary-background-dark rounded-xl`,
      disabled && tw`opacity-50`,
      isSelected ? tw`border-primary-main` : tw`border-transparent`,
      style,
      isSelected && selectedStyle,
    ]}
  >
    {typeof display === "string" ? (
      <PeachText style={tw`flex-1 subtitle-1`}>{display}</PeachText>
    ) : (
      <View style={tw`flex-1`}>{display}</View>
    )}
    <Icon
      id={disabled ? "minusCircle" : isSelected ? "radioSelected" : "circle"}
      style={tw`w-5 h-5`}
      color={tw.color(
        isSelected ? radioIconColor || "primary-main" : "black-50",
      )}
    />
  </TouchableOpacity>
);
