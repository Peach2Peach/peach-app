import { Keyboard, Pressable, StyleProp, View, ViewStyle } from "react-native";
import tw from "../../styles/tailwind";
import { PopupText } from "../text/PopupText";
import { PopupActions } from "./PopupActions";

export type PopupComponentProps = {
  content?: JSX.Element | string;
  actions: React.ReactNode;
  title?: string;
  bgColor?: ViewStyle;
  actionBgColor?: ViewStyle;
  textColor?: string; // New prop to customize text color
};

export const PopupComponent = ({
  content,
  actions,
  title,
  bgColor,
  actionBgColor,
  textColor = "text-black-100", // Default text color fallback
}: PopupComponentProps) => (
  <View style={tw`mx-3 overflow-hidden rounded-2xl`}>
    <PopupContent style={[bgColor, tw`items-stretch`]}>
      {!!title && <PopupTitle text={title} textColor={textColor} />}
      {typeof content === "string" ? (
        <PopupText style={tw`${textColor}`}>{content}</PopupText> // Ensure text color is applied
      ) : (
        // If content is JSX, ensure children elements are styled correctly using a wrapper
        <View style={tw`${textColor}`}>{content}</View> // This ensures the text color is applied to nested content as well
      )}
    </PopupContent>
    <PopupActions style={actionBgColor}>{actions}</PopupActions>
  </View>
);

function PopupTitle({ text, textColor }: { text: string; textColor: string }) {
  return <PopupText style={tw`w-full h5 ${textColor}`}>{text}</PopupText>;
}

type ContentProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};
function PopupContent({ children, style }: ContentProps) {
  return (
    <Pressable
      style={[
        tw`items-stretch gap-3 p-6 pt-4 bg-primary-background-dark-color`,
        style,
      ]}
      onPress={Keyboard.dismiss}
    >
      {children}
    </Pressable>
  );
}
