import { useState } from "react";
import { RadioButtonItem } from "../../components/inputs/RadioButtons";
import { useOfferPreferences } from "../../store/offerPreferenes";
import i18n from "../../utils/i18n";
import { ApplySortersAction } from "./ApplySortersAction";
import { SorterPopup } from "./SorterPopup";

export const BuySorters = () => {
  const defaultSorter = useOfferPreferences(
    (state) => state.sortBy.buyOffer[0],
  );
  const [sortBy, setSortBy] = useState(defaultSorter);
  const items: RadioButtonItem<BuySorter>[] = [
    {
      display: i18n("offer.sorting.bestReputation"),
      value: "bestReputation",
    },
    {
      display: i18n("offer.sorting.highestAmount"),
      value: "highestAmount",
    },
    {
      display: i18n("offer.sorting.lowestPremium"),
      value: "lowestPremium",
    },
  ];
  const setBuyOfferSorter = useOfferPreferences(
    (state) => state.setBuyOfferSorter,
  );

  return (
    <SorterPopup
      radioButtonProps={{
        items,
        selectedValue: sortBy,
        onButtonPress: setSortBy,
      }}
      applyAction={
        <ApplySortersAction setSorterAction={() => setBuyOfferSorter(sortBy)} />
      }
    />
  );
};
