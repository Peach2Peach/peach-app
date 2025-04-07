import { useState } from "react";
import { useOfferPreferences } from "../../store/offerPreferenes";
import i18n from "../../utils/i18n";
import { ApplySortersAction } from "./ApplySortersAction";
import { SorterPopup } from "./SorterPopup";

interface BuySortersProps {
  onApply: Function;
}

export const BuySorters = ({ onApply }: BuySortersProps) => {
  const defaultSorter = useOfferPreferences(
    (state) => state.sortBy.buyOffer[0],
  );
  const [sortBy, setSortBy] = useState(defaultSorter);
  const items = [
    {
      display: i18n("offer.sorting.bestReputation"),
      value: "bestReputation",
    } as const,
    {
      display: i18n("offer.sorting.highestAmount"),
      value: "highestAmount",
    } as const,
    {
      display: i18n("offer.sorting.lowestPremium"),
      value: "lowestPremium",
    } as const,
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
        <ApplySortersAction
          setSorterAction={() => {
            setBuyOfferSorter(sortBy);
            onApply();
          }}
        />
      }
    />
  );
};
