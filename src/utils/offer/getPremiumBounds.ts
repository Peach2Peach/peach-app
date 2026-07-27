import { premiumBounds } from "../../components/PremiumInput";
import {
  MAXIMUM_CHF_AMOUNT_OF_OFFER,
  MINIMUM_CHF_AMOUNT_OF_OFFER,
  SATSINBTC,
} from "../../constants";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/**
 * The premium range allowed for a given amount of sats, constrained by the
 * min/max CHF value an offer may have. Mirrors the logic in PremiumInput and
 * usePremiumSliderSetup.
 */
export const getPremiumBounds = (amount: number, currentCHFPrice: number) => {
  const baseCHF = (amount / SATSINBTC) * currentCHFPrice;
  const boundsAreComputable = baseCHF > 0;

  const min = clamp(
    boundsAreComputable
      ? Math.ceil((MINIMUM_CHF_AMOUNT_OF_OFFER / baseCHF - 1) * 100)
      : premiumBounds.min,
    premiumBounds.min,
    premiumBounds.max,
  );

  const max = clamp(
    boundsAreComputable
      ? Math.floor((MAXIMUM_CHF_AMOUNT_OF_OFFER / baseCHF - 1) * 100)
      : premiumBounds.max,
    premiumBounds.min,
    premiumBounds.max,
  );

  return { min, max };
};
