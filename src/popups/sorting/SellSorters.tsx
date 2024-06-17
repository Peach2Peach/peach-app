import { useState } from "react";
import { RadioButtonItem } from "../../components/inputs/RadioButtons";
import { useOfferPreferences } from "../../store/offerPreferences";
import { ApplySortersAction } from "./ApplySortersAction";
import { SorterPopup } from "./SorterPopup";
import { useTranslate } from "@tolgee/react";

export const SellSorters = () => {
  const defaultSorter = useOfferPreferences(
    (state) => state.sortBy.sellOffer[0],
  );
  const [sortBy, setSortBy] = useState<SellSorter>(defaultSorter);
  const { t } = useTranslate("offer");
  const items: RadioButtonItem<SellSorter>[] = [
    {
      display: t("offer.sorting.bestReputation"),
      value: "bestReputation",
    },
    {
      display: t("offer.sorting.highestPrice"),
      value: "highestPrice",
    },
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
