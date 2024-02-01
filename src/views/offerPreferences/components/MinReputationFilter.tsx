import { Checkbox } from "../../../components/inputs/Checkbox";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { MIN_REPUTATION_FILTER } from "./MIN_REPUTATION_FILTER";

type Props = {
  minReputation: number | null;
  toggle: () => void;
};

export function ReputationFilterComponent({ minReputation, toggle }: Props) {
  const checked = minReputation === MIN_REPUTATION_FILTER;
  return (
    <Checkbox green checked={checked} onPress={toggle} style={tw`self-stretch`}>
      {i18n("offerPreferences.filters.minReputation", "4.5")}
    </Checkbox>
  );
}
