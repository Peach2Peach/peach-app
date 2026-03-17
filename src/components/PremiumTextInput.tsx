import { useMemo, useState } from "react";
import { premiumBounds } from "./PremiumInput";
import { PercentageInput } from "./inputs/PercentageInput";

type Props = {
  premium: number;
  setPremium: (newPremium: number) => void;
  maximumPremiumAllowed?: number;
  minimumPremiumAllowed?: number;
};

export function PremiumTextInput({
  premium,
  setPremium,
  minimumPremiumAllowed,
  maximumPremiumAllowed,
}: Props) {
  const [displayPremium, setDisplayPremium] = useState(premium.toString());

  const displayValue = useMemo(() => {
    const displayPremiumAsNumber =
      convertDisplayPremiumToNumber(displayPremium);
    if (premium === displayPremiumAsNumber) return displayPremium;
    return premium.toString();
  }, [premium, displayPremium]);

  const changePremium = (value: string) => {
    const newPremium = enforcePremiumFormat(
      value,
      minimumPremiumAllowed,
      maximumPremiumAllowed,
    );
    setDisplayPremium(newPremium);
    setPremium(
      convertDisplayPremiumToNumber(
        newPremium,
        minimumPremiumAllowed,
        maximumPremiumAllowed,
      ),
    );
  };

  return <PercentageInput value={displayValue} onChange={changePremium} />;
}

function convertDisplayPremiumToNumber(
  displayPremium: string,
  minimumPremiumAllowed?: number,
  maximumPremiumAllowed?: number,
) {
  const asNumberType = Number(
    enforcePremiumFormat(
      displayPremium,
      minimumPremiumAllowed,
      maximumPremiumAllowed,
    ),
  );
  if (isNaN(asNumberType)) return 0;
  return asNumberType;
}

function enforcePremiumFormat(
  premium: string,
  minimumPremiumAllowed?: number,
  maximumPremiumAllowed?: number,
) {
  if (premium === "") return "";
  if (premium === "0") return "0";

  const effectiveMinPremium =
    minimumPremiumAllowed === undefined
      ? premiumBounds.min
      : minimumPremiumAllowed;
  const effectiveMaxPremium =
    maximumPremiumAllowed === undefined
      ? premiumBounds.min
      : maximumPremiumAllowed;

  const number = Number(premium);
  if (isNaN(number)) return String(premium).trim();
  if (number < effectiveMinPremium) return String(effectiveMinPremium);
  if (number > effectiveMaxPremium) return String(effectiveMaxPremium);
  return String(premium).trim().replace(/^0/u, "");
}
