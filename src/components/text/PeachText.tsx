import { Text, TextProps } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { shouldNormalCase } from "./helpers/shouldNormalCase";

export const PeachText = ({ style, ...props }: TextProps) => {
  const { isDarkMode } = useThemeStore();

  return (
    <Text
      style={[
        tw`body-m text-black-100`,
        isDarkMode && tw`text-backgroundLight-light`,
        style,
        shouldNormalCase(style) && tw`normal-case`,
      ]}
      allowFontScaling={false}
      {...props}
    />
  );
};
