import { Text, TextProps } from "react-native";
import { useThemeStore } from "../../store/theme"; // Import theme store for dark mode check
import tw from "../../styles/tailwind";
import { shouldNormalCase } from "./helpers/shouldNormalCase";

export const PeachText = ({ style, ...props }: TextProps) => {
  const { isDarkMode } = useThemeStore(); // Access dark mode state

  // Define default styles based on theme
  const defaultTextStyle = isDarkMode
    ? tw`text-backgroundLight-light` // Light text for dark backgrounds
    : tw`text-black-100`; // Dark text for light backgrounds

  return (
    <Text
      style={[
        tw`body-m`,
        defaultTextStyle, // Apply default style based on theme
        style, // Custom styles passed in
        shouldNormalCase(style) && tw`normal-case`,
      ]}
      allowFontScaling={false}
      {...props}
    />
  );
};
