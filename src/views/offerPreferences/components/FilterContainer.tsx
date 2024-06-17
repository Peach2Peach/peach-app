import { View } from "react-native";
import tw from "../../../styles/tailwind";
import { Section } from "./Section";
import { useTranslate } from "@tolgee/react";

export function FilterContainer({ filters }: { filters: React.ReactNode }) {
  const { t } = useTranslate("offerPreferences");
  return (
    <Section.Container style={tw`bg-success-mild-1`}>
      <Section.Title>{t("offerPreferences.filters")}</Section.Title>
      <View style={tw`items-center self-stretch gap-10px`}>{filters}</View>
    </Section.Container>
  );
}
