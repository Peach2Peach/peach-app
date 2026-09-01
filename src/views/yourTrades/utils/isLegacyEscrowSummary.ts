import { ESCROW_VERSION } from "../../../../peach-api";
import { ContractSummary } from "../../../../peach-api/src/@types/contract";
import { OfferSummary } from "../../../../peach-api/src/@types/offer";
import { isContractSummary } from "./isContractSummary";

/**
 * @description a sell offer on a legacy escrow can no longer be traded, so the
 * only way out is cancelling it and refunding the escrow.
 *
 * Unlike everywhere else, a *missing* escrowVersion is not treated as legacy:
 * the offer summaries endpoint only started sending the field with the
 * single-sig release, and telling every seller to refund because an older
 * server left it out would be far worse than showing them a stale label.
 */
export const isLegacyEscrowSummary = (
  summary: OfferSummary | ContractSummary,
) =>
  !isContractSummary(summary) &&
  summary.type === "ask" &&
  summary.tradeStatusNew === "waitingForTradeRequest" &&
  typeof summary.escrowVersion === "number" &&
  summary.escrowVersion !== ESCROW_VERSION;
