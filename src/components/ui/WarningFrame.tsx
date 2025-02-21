import { View } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

export function WarningFrame({ text }: { text: string }) {
  const { isDarkMode } = useThemeStore();
  return (
    <View
      style={tw`items-center px-4 border-2 rounded-lg py-10px border-error-main gap-10px max-w-230px`}
    >
      <View
        style={tw`absolute items-center justify-center rounded-full -left-4 top-4px bg-primary-background-light`}
      >
        <Icon size={24} id="alertCircle" color={tw.color("error-main")} />
      </View>
      <PeachText
        style={tw`${isDarkMode ? "text-primary-background-light" : "text-black-100"}`}
      >
        {text}
      </PeachText>
    </View>
  );
}
