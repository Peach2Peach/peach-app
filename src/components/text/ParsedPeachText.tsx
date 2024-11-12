import ParsedText, { ParsedTextProps } from "react-native-parsed-text";
import { useThemeStore } from "../../store/theme"; // Import theme store for dark mode check
import tw from "../../styles/tailwind";
import { shouldNormalCase } from "./helpers/shouldNormalCase";

export type Props = ComponentProps & ParsedTextProps;

export const ParsedPeachText = ({ style, ...props }: Props) => {
  const { isDarkMode } = useThemeStore(); // Access dark mode state

  return (
    <ParsedText
      style={[
        tw`body-m ${isDarkMode ? "text-backgroundLight-light" : "text-black-100"}`, // Adapt for dark mode
        style,
        shouldNormalCase(style) && tw`normal-case`,
      ]}
      allowFontScaling={false}
      {...props}
    />
  );
};
