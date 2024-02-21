import { Checkbox } from "../../../components/inputs/Checkbox";
import tw from "../../../styles/tailwind";
import { MIN_REPUTATION_FILTER } from "./MIN_REPUTATION_FILTER";
import { useTranslate } from "@tolgee/react";

type Props = {
  minReputation: number | null;
  toggle: () => void;
};

export function ReputationFilterComponent({ minReputation, toggle }: Props) {
  const { t } = useTranslate("offerPreferences");
  const checked = minReputation === MIN_REPUTATION_FILTER;
  return (
    <Checkbox green checked={checked} onPress={toggle} style={tw`self-stretch`}>
      {t("offerPreferences.filters.minReputation", "4.5")}
    </Checkbox>
  );
}
