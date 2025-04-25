import { View } from "react-native";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { Section } from "./Section";

export function FilterContainer({ filters }: { filters: React.ReactNode }) {
  const { isDarkMode } = useThemeStore();
  return (
    <Section.Container
      style={tw`${isDarkMode ? "bg-card" : "bg-success-mild-1-color"}`}
    >
      <Section.Title>{i18n("offerPreferences.filters")}</Section.Title>
      <View style={tw`items-center self-stretch gap-10px`}>{filters}</View>
    </Section.Container>
  );
}
