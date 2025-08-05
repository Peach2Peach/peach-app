import { shallow } from "zustand/shallow";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { useOfferPreferences } from "../../store/offerPreferenes";
import tw from "../../styles/tailwind";
import { AmountSelectorComponent } from "../offerPreferences/components/AmountSelectorComponent";

export function ExpressBuyFilters() {
  const title = "Filter Sell Offers";

  return (
    <Screen header={<Header title={title} />}>
      <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
        <AmountSelector />
      </PeachScrollView>
    </Screen>
  );
}

function AmountSelector() {
  const [expressBuyFilterByAmountRange, setExpressBuyFilterByAmountRange] =
    useOfferPreferences(
      (state) => [
        state.expressBuyFilterByAmountRange,
        state.setExpressBuyFilterByAmountRange,
      ],
      shallow,
    );

  return (
    <AmountSelectorComponent
      setIsSliding={() => {}}
      range={expressBuyFilterByAmountRange}
      setRange={setExpressBuyFilterByAmountRange}
    />
  );
}
