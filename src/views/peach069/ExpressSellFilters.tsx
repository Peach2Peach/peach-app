import { shallow } from "zustand/shallow";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { useOfferPreferences } from "../../store/offerPreferenes";
import tw from "../../styles/tailwind";
import { AmountSelectorComponent } from "../offerPreferences/components/AmountSelectorComponent";

export function ExpressSellFilters() {
  const title = "Filter Buy Offers";

  return (
    <Screen header={<Header title={title} />}>
      <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
        <AmountSelector />
      </PeachScrollView>
    </Screen>
  );
}

function AmountSelector() {
  const [expressSellFilterByAmountRange, setExpressSellFilterByAmountRange] =
    useOfferPreferences(
      (state) => [
        state.expressSellFilterByAmountRange,
        state.setExpressSellFilterByAmountRange,
      ],
      shallow,
    );

  return (
    <AmountSelectorComponent
      setIsSliding={() => {}}
      range={expressSellFilterByAmountRange}
      setRange={setExpressSellFilterByAmountRange}
      isSell
    />
  );
}
