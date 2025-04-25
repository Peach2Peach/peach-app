import { View } from "react-native";
import { PeachScrollView } from "../../../components/PeachScrollView";
import tw from "../../../styles/tailwind";

type Props = {
  children: React.ReactNode;
  isSliding: boolean;
  button: React.ReactNode;
};

export function PreferenceScreen({ children, button, isSliding }: Props) {
  return (
    <>
      <PeachScrollView
        contentStyle={tw`gap-6`}
        scrollEnabled={!isSliding}
        showsVerticalScrollIndicator
      >
        {children}
      </PeachScrollView>
      <View style={tw`pt-5`}>{button}</View>
    </>
  );
}
