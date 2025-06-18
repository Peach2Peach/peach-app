import { View } from "react-native";
import tw from "../styles/tailwind";
import { Icon } from "./Icon";
import { PeachText } from "./text/PeachText";

export function ErrorBox({ message }: { message: string }) {
  return (
    <View
      style={tw`flex-row items-center gap-3 px-3 py-2 rounded-xl bg-error-light`}
    >
      <Icon
        id="alertTriangle"
        size={24}
        color={tw.color("primary-background-light")}
      />
      <PeachText style={tw`shrink subtitle-2 text-primary-background-light`}>
        {message}
      </PeachText>
    </View>
  );
}
