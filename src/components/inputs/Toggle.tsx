import { ReactNode } from "react";
import { TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type Props = {
  children?: ReactNode;
  style?: ViewStyle;
  enabled: boolean;
  disabled?: boolean;
  onPress: () => void;
  textStyle?: TextStyle;
  green?: boolean;
};
export const Toggle = ({
  enabled,
  disabled,
  onPress,
  children,
  style,
  textStyle,
  green,
}: Props) => (
  <TouchableOpacity
    style={[tw`flex-row items-center gap-4`, disabled && tw`opacity-33`, style]}
    onPress={onPress}
    disabled={disabled}
  >
    {!!children && (
      <PeachText style={[tw`settings`, textStyle]}>{children}</PeachText>
    )}
    {enabled ? (
      <Icon
        id="toggleRight"
        size={32}
        color={tw.color(green ? "success-main" : "primary-main")}
      />
    ) : (
      <Icon id="toggleLeft" size={32} color={tw.color("black-50")} />
    )}
  </TouchableOpacity>
);
