import { View } from "react-native";
import { useThemeStore } from "../store/theme"; // Import theme store to check dark mode
import tw from "../styles/tailwind";
import { FixedHeightText } from "./text/FixedHeightText";

type InfoContainerProps = {
  text: string;
  icon: JSX.Element;
  color?: string;
  textColor?: string;
  backgroundColor?: string;
  enabled?: boolean;
};
export const horizontalBadgePadding = 6;
export function InfoContainer({
  text,
  icon,
  color,
  textColor,
  backgroundColor = tw.color("primary-background-light-color"),
  enabled = true,
}: InfoContainerProps) {
  const { isDarkMode } = useThemeStore(); // Access dark mode state
  const colorStyle = color ?? tw.color(enabled ? "primary-main" : isDarkMode ? "black-65" : "primary-mild-1");
  const textStyle = textColor ?? colorStyle;
  const adjustedBackgroundColor = isDarkMode ? "transparent" : backgroundColor; // Set background color conditionally

  return (
    <View
      style={[
        tw`flex-row items-center py-1 border rounded-full gap-2px`,
        {
          backgroundColor: adjustedBackgroundColor,
          borderColor: colorStyle,
          paddingHorizontal: horizontalBadgePadding,
        },
      ]}
    >
      <FixedHeightText
        height={6}
        style={[tw`subtitle-2 text-10px`, { color: textStyle }]}
      >
        {text}
      </FixedHeightText>
      {icon}
    </View>
  );
}
