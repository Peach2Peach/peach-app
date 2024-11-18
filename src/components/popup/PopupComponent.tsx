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
};

export const PopupComponent = ({
  content,
  actions,
  title,
  bgColor,
  actionBgColor,
}: PopupComponentProps) => (
  <View style={tw`mx-3 overflow-hidden rounded-2xl`}>
    <PopupContent style={[bgColor, tw`items-stretch`]}>
      {!!title && <PopupTitle text={title} />}
      {typeof content === "string" ? (
        <PopupText>{content}</PopupText>
      ) : (
        content
      )}
    </PopupContent>
    <PopupActions style={actionBgColor}>{actions}</PopupActions>
  </View>
);

function PopupTitle({ text }: { text: string }) {
  return <PopupText style={tw`w-full h5`}>{text}</PopupText>;
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
