import { Contract } from "../../../peach-api/src/@types/contract";

export const canCancelContract = (
  contract: Contract,
  view: "buyer" | "seller",
) =>
  !contract.disputeActive &&
  (!contract.paymentMade || view === "buyer") &&
  !contract.canceled &&
  !contract.cancelationRequested &&
  contract.tradeStatus !== "fundingExpired" &&
  !(
    view === "seller" &&
    (contract.paymentExpectedBy?.getTime() || 0) < Date.now()
  );
