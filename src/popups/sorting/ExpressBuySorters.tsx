import { useState } from "react";
import { RadioButtonItem } from "../../components/inputs/RadioButtons";
import { useOfferPreferences } from "../../store/offerPreferenes";
import i18n from "../../utils/i18n";
import { ApplySortersAction } from "./ApplySortersAction";
import { SorterPopup } from "./SorterPopup";

export const ExpressBuySorters = () => {
  const defaultSorter = useOfferPreferences(
    (state) => state.expressBuyOffersSorter,
  );
  const [sortBy, setSortBy] = useState(defaultSorter);
  console.log("sort buy: ", sortBy);
  const items: RadioButtonItem<ExpressBuyOfferSorter>[] = [
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
      display: i18n("offer.sorting.lowestPremium"),
      value: "lowestPremium",
    },
  ];
  const setSorter = useOfferPreferences(
    (state) => state.setExpressBuyOffersSorter,
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
