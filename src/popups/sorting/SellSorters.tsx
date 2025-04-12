import { useState } from "react";
import { useOfferPreferences } from "../../store/offerPreferenes";
import i18n from "../../utils/i18n";
import { ApplySortersAction } from "./ApplySortersAction";
import { SorterPopup } from "./SorterPopup";

export const SellSorters = () => {
  const defaultSorter = useOfferPreferences(
    (state) => state.sortBy.sellOffer[0],
  );
  const [sortBy, setSortBy] = useState(defaultSorter);
  const items = [
    {
      display: i18n("offer.sorting.bestReputation"),
      value: "bestReputation",
    } as const,
    {
      display: i18n("offer.sorting.highestPrice"),
      value: "highestPrice",
    } as const,
  ];
  const setSellOfferSorter = useOfferPreferences(
    (state) => state.setSellOfferSorter,
  );

  return (
    <SorterPopup
      radioButtonProps={{
        items,
        selectedValue: sortBy,
        onButtonPress: setSortBy,
      }}
      applyAction={
        <ApplySortersAction
          setSorterAction={() => setSellOfferSorter(sortBy)}
        />
      }
    />
  );
};
