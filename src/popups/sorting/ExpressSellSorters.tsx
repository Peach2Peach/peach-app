import { useState } from "react";
import { RadioButtonItem } from "../../components/inputs/RadioButtons";
import { useOfferPreferences } from "../../store/offerPreferenes";
import i18n from "../../utils/i18n";
import { ApplySortersAction } from "./ApplySortersAction";
import { SorterPopup } from "./SorterPopup";

export const ExpressSellSorters = () => {
  const defaultSorter = useOfferPreferences(
    (state) => state.expressSellOffersSorter,
  );
  const [sortBy, setSortBy] = useState(defaultSorter);
  const items: RadioButtonItem<ExpressSellOfferSorter>[] = [
    {
      display: i18n("offer.sorting.bestReputation"),
      value: "bestReputation",
    },
    {
      display: i18n("offer.sorting.highestAmount"),
      value: "highestAmount",
    },
    {
      display: i18n("offer.sorting.lowestAmount"),
      value: "lowestAmount",
    },
    {
      display: i18n("offer.sorting.highestPremium"),
      value: "highestPremium",
    },
  ];
  const setSorter = useOfferPreferences(
    (state) => state.setExpressSellOffersSorter,
  );

  return (
    <SorterPopup
      radioButtonProps={{
        items,
        selectedValue: sortBy,
        onButtonPress: setSortBy,
      }}
      applyAction={
        <ApplySortersAction setSorterAction={() => setSorter(sortBy)} />
      }
    />
  );
};
