import { View } from "react-native";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { Section } from "./Section";

export function FilterContainer({ filters }: { filters: React.ReactNode }) {
  return (
    <Section.Container style={tw`bg-success-mild-1`}>
      <Section.Title>{i18n("offerPreferences.filters")}</Section.Title>
      <View style={tw`items-center self-stretch gap-10px`}>{filters}</View>
    </Section.Container>
  );
}
