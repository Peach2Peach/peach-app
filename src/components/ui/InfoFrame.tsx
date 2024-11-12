import { View } from "react-native";
import { useThemeStore } from "../../store/theme"; // Import theme store for dark mode check
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

type Props = {
  text: string;
};

export function InfoFrame({ text }: Props) {
  const { isDarkMode } = useThemeStore(); // Access dark mode state
  return (
    <View
      style={tw`items-center px-4 border-2 rounded-lg py-10px border-info-light gap-10px max-w-230px`}
    >
      <View
        style={tw`absolute -left-4 top-4px bg-primary-background-light-color rounded-full items-center justify-center`} // Set rounded-full, width, height, and centering
      >
        <Icon size={24} id="info" color={tw.color("info-main")} />
      </View>
      <PeachText
        style={tw`${isDarkMode ? "text-primary-background-light-color" : "text-black-100"}`}
      >
        {text}
      </PeachText>
    </View>
  );
}
