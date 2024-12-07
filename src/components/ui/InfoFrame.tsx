import { View } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type Props = {
  text: string;
};

export function InfoFrame({ text }: Props) {
  const { isDarkMode } = useThemeStore();
  return (
    <View
      style={tw`items-center px-4 border-2 rounded-lg py-10px border-info-light gap-10px max-w-230px`}
    >
      <View
        style={tw`absolute items-center justify-center rounded-full -left-4 top-4px bg-primary-background-light`}
      >
        <Icon size={24} id="info" color={tw.color("info-main")} />
      </View>
      <PeachText
        style={tw`${isDarkMode ? "text-primary-background-light" : "text-black-100"}`}
      >
        {text}
      </PeachText>
    </View>
  );
}
