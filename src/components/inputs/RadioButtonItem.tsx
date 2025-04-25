import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type Props = {
  display: ReactNode;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export const RadioButtonItem = ({
  display,
  isSelected,
  disabled,
  onPress,
}: Props) => {
  const { isDarkMode } = useThemeStore();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        tw`flex-row items-center justify-between w-full gap-2 px-4 py-2 border-2 rounded-xl`,
        isDarkMode ? tw`bg-card` : tw`bg-primary-background-dark-color`,
        disabled && tw`opacity-50`,
        isSelected ? tw`border-primary-main` : tw`border-transparent`,
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
        color={tw.color(isSelected ? "primary-main" : "black-50")}
      />
    </TouchableOpacity>
  );
};
