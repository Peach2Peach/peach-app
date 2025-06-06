import { TouchableOpacity } from "react-native";
import { FillProps } from "react-native-svg";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type Props = ComponentProps & {
  checked: boolean;
  onPress: () => void;
  iconProps?: ComponentProps & { color: FillProps["fill"] };
  green?: boolean;
};
export const Checkbox = ({
  checked,
  green,
  iconProps,
  style,
  children,
  ...wrapperProps
}: Props) => {
  const { isDarkMode } = useThemeStore();

  return (
    <TouchableOpacity
      {...wrapperProps}
      style={[style, tw`flex-row items-center gap-1`]}
    >
      <Icon
        id={checked ? "checkboxMark" : "square"}
        {...iconProps}
        color={
          checked
            ? tw.color(green ? "success-main" : "primary-main")
            : tw.color("black-50")
        }
      />
      {!!children && (
        <PeachText
          style={[
            tw`subtitle-1 shrink`,
            !checked
              ? tw`text-black-25`
              : isDarkMode
                ? tw`text-backgroundLight-light`
                : tw`text-primary-main`,
          ]}
        >
          {children}
        </PeachText>
      )}
    </TouchableOpacity>
  );
};
