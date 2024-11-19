import { Text, TextProps } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { shouldNormalCase } from "./helpers/shouldNormalCase";

export const PeachText = ({ style, ...props }: TextProps) => {
  const { isDarkMode } = useThemeStore();

  return (
    <Text
      style={[
        tw`body-m`,
        isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
        style,
        shouldNormalCase(style) && tw`normal-case`,
      ]}
      allowFontScaling={false}
      {...props}
    />
  );
};
