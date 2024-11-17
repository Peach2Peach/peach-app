import { TouchableOpacity, View } from "react-native";
import { useThemeStore } from "../../store/theme"; // Import theme store for dark mode check
import tw from "../../styles/tailwind";
import { statusCardStyles } from "./statusCardStyles";

type Props = {
  onPress: () => void;
  color: keyof typeof statusCardStyles.bg;
  statusInfo?: JSX.Element;
  amountInfo?: JSX.Element;
  label?: JSX.Element;
};

export function StatusCard({
  color,
  onPress,
  statusInfo,
  amountInfo,
  label,
}: Props) {
  const { isDarkMode } = useThemeStore(); // Access dark mode state

  return (
    <TouchableOpacity
      style={[
        tw`overflow-hidden border rounded-xl`,
        isDarkMode
          ? tw`bg-card` // Dark mode background
          : tw`bg-primary-background-light-color`, // Light mode background
        tw.style(statusCardStyles.border[color]),
      ]}
      onPress={onPress}
    >
      <View style={tw`flex-row items-center justify-between px-4 py-3`}>
        {statusInfo}
        {amountInfo}
      </View>
      {label}
    </TouchableOpacity>
  );
}
