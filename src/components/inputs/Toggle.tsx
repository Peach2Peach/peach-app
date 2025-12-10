import { TextStyle, TouchableOpacity } from "react-native";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type Props = ComponentProps & {
  enabled: boolean;
  disabled?: boolean;
  onPress: () => void;
  textStyle?: TextStyle;
  red?: boolean;
  textOnRight?: boolean;
};
export const Toggle = ({
  enabled,
  disabled,
  onPress,
  children,
  style,
  textStyle,
  red = true,
  textOnRight = false,
}: Props) => (
  <TouchableOpacity
    style={[tw`flex-row items-center gap-4`, disabled && tw`opacity-33`, style]}
    onPress={onPress}
    disabled={disabled}
  >
    {!!children && !textOnRight && (
      <PeachText style={[tw`settings`, textStyle]}>{children}</PeachText>
    )}
    {enabled ? (
      <Icon
        id="toggleRight"
        size={32}
        color={red ? tw.color("primary-main") : tw.color("success-main")}
      />
    ) : (
      <Icon id="toggleLeft" size={32} color={tw.color("black-50")} />
    )}
    {!!children && textOnRight && (
      <PeachText style={[tw`settings`, textStyle]}>{children}</PeachText>
    )}
  </TouchableOpacity>
);
