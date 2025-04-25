import { ReactNode } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type CheckboxType = {
  value: string | number;
  disabled?: boolean;
  display: ReactNode;
};

type CheckboxProps = {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  item: CheckboxType;
  checked: boolean;
  editing: boolean;
};

export const PaymentDetailsCheckbox = ({
  item,
  checked,
  onPress,
  style,
  editing,
}: CheckboxProps) => {
  const { isDarkMode } = useThemeStore();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`flex-row items-center justify-between w-full gap-4 px-3 py-2 border-2 rounded-xl`,
        isDarkMode ? tw`bg-card` : tw`bg-primary-background-dark-color`,
        checked && !item.disabled && !editing
          ? tw`border-primary-main`
          : tw`border-transparent`,
        style,
      ]}
    >
      <PeachText
        style={tw`flex-1 ${isDarkMode ? "text-backgroundLight-light" : ""}`}
      >
        {item.display}
      </PeachText>
      {!item.disabled ? (
        <Icon
          id={editing ? "edit3" : checked ? "checkboxMark" : "square"}
          color={tw.color(
            editing || checked
              ? "primary-main"
              : isDarkMode
                ? "backgroundLight-light"
                : "black-50",
          )}
        />
      ) : (
        <View style={tw`w-5 h-5 ml-4`} />
      )}
    </TouchableOpacity>
  );
};
