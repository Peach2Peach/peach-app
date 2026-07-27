import { FundingStatus } from "../../../peach-api/src/@types/offer";

/**
 * The escrow endpoint returns funding as two sibling fields — `funding`
 * (bitcoin) and `fundingLiquid` (liquid) — one per chain the offer could use.
 * A liquid offer leaves `funding` at NULL and populates `fundingLiquid`;
 * mainchain does the reverse. Pick whichever chain is actually being funded so
 * the rest of the app can read a single flat status.
 */
export function pickFundingStatus(
  funding: FundingStatus,
  fundingLiquid?: FundingStatus,
): FundingStatus {
  if (fundingLiquid && fundingLiquid.status !== "NULL") return fundingLiquid;
  return funding;
}
