import { Text, TextProps } from "react-native";
import tw from "../../styles/tailwind";
import { shouldNormalCase } from "./helpers/shouldNormalCase";

export const PopupText = ({ style, ...props }: TextProps) => (
  <Text
    style={[
      tw`body-m text-black-100`,
      style,
      shouldNormalCase(style) && tw`normal-case`,
    ]}
    allowFontScaling={false}
    {...props}
  />
);
