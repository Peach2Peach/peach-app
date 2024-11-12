import { TouchableOpacity } from "react-native";
import { FillProps } from "react-native-svg";
import { useThemeStore } from "../../store/theme"; // Import theme store for dark mode check
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
  const { isDarkMode } = useThemeStore(); // Access dark mode state

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
              : tw`text-primary-main`, // Default text color when checked in light mode
          ]}
        >
          {children}
        </PeachText>
      )}
    </TouchableOpacity>
  );
};
