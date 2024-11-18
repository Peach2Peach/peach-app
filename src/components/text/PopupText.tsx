import { Text, TextProps } from "react-native";
import tw from "../../styles/tailwind";
import { shouldNormalCase } from "./helpers/shouldNormalCase";

// Define a new variant of PeachText without dark mode consideration
export const PopupText = ({ style, ...props }: TextProps) => {
  // Default style (you can customize the default if needed)
  const defaultTextStyle = tw`text-black-100`; // Default to black text, change as needed

  return (
    <Text
      style={[
        tw`body-m`, // Base style, can be modified as needed
        defaultTextStyle, // Apply default style
        style, // Custom styles passed in
        shouldNormalCase(style) && tw`normal-case`, // Optional utility function for text casing
      ]}
      allowFontScaling={false}
      {...props}
    />
  );
};
