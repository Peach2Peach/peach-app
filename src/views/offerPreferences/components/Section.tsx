import { View } from "react-native";
import { PeachText } from "../../../components/text/PeachText";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";

export const sectionContainerPadding = 12;
export const sectionContainerGap = 10;

function Container({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: View["props"]["style"];
}) {
  return (
    <View
      style={[
        tw`items-center w-full rounded-2xl`,
        { gap: sectionContainerGap, padding: sectionContainerPadding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const Section = {
  Container,
  Title: ({ children }: { children: React.ReactNode }) => {
    const { isDarkMode } = useThemeStore();
    return (
      <PeachText
        style={tw`${isDarkMode ? "text-backgroundLight-light" : "text-black-100"} subtitle-1`}
      >
        {children}
      </PeachText>
    );
  },
};

export { Section };
