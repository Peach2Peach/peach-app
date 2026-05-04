import { Text, TextProps } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { useI18n } from "../../utils/i18n";
import { shouldNormalCase } from "./helpers/shouldNormalCase";

export const PeachText = ({
  style,
  ignoreDarkMode,
  ...props
}: TextProps & { ignoreDarkMode?: boolean }) => {
  const { isDarkMode } = useThemeStore();
  useI18n();
  return (
    <Text
      style={[
        tw`body-m text-black-100`,
        isDarkMode && !ignoreDarkMode && tw`text-backgroundLight-light`,
        style,
        shouldNormalCase(style) && tw`normal-case`,
      ]}
      allowFontScaling={false}
      {...props}
    />
  );
};
