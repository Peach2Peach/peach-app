import ParsedText, { ParsedTextProps } from "react-native-parsed-text";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { shouldNormalCase } from "./helpers/shouldNormalCase";

export type Props = ComponentProps & ParsedTextProps;

export const ParsedPeachText = ({ style, ...props }: Props) => {
  const { isDarkMode } = useThemeStore();

  return (
    <ParsedText
      style={[
        tw`body-m ${isDarkMode ? "text-backgroundLight-light" : "text-black-100"}`,
        style,
        shouldNormalCase(style) && tw`normal-case`,
      ]}
      allowFontScaling={false}
      {...props}
    />
  );
};
