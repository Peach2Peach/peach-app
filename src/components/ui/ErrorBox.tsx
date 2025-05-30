import { View } from "react-native";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

export const ErrorBox = ({ children, style }: ComponentProps) => (
  <View
    style={[
      tw`flex-row items-center px-3 py-2 rounded-xl bg-error-light`,
      style,
    ]}
  >
    <Icon
      id="alertTriangle"
      style={tw`w-6 h-6`}
      color={tw.color("primary-background-light-color")}
    />
    <View style={tw`shrink w-full pl-3`}>
      <PeachText style={tw`subtitle-2 text-primary-background-light-color`}>
        {children}
      </PeachText>
    </View>
  </View>
);
