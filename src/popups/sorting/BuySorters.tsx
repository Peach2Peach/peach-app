import { useState } from "react";
import { RadioButtonItem } from "../../components/inputs/RadioButtons";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { ApplySortersAction } from "./ApplySortersAction";
import { SorterPopup } from "./SorterPopup";
import { useTranslate } from "@tolgee/react";

export const BuySorters = () => {
  const defaultSorter = useOfferPreferences(
    (state) => state.sortBy.buyOffer[0],
  );
  const [sortBy, setSortBy] = useState(defaultSorter);
  const { t } = useTranslate("offer");
  const items: RadioButtonItem<BuySorter>[] = [
    {
      display: t("offer.sorting.bestReputation"),
      value: "bestReputation",
    },
    {
      display: t("offer.sorting.highestAmount"),
      value: "highestAmount",
    },
    {
      display: t("offer.sorting.lowestPremium"),
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
