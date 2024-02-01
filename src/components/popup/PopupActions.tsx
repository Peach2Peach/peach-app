import { View, ViewStyle } from "react-native";
import tw from "../../styles/tailwind";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export const PopupActions = ({ children, style }: Props) => (
  <View
    style={[
      tw`flex-row items-center self-stretch justify-between bg-primary-main`,
      style,
    ]}
  >
    {children}
  </View>
);
