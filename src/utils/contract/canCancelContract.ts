import { Contract } from "../../../peach-api/src/@types/contract";

export const canCancelContract = (
  contract: Contract,
  view: "buyer" | "seller",
) => {
  if (contract.paymentMade) return false;
  return (
    !contract.disputeActive &&
    (!contract.paymentMade || view === "buyer") &&
    !contract.canceled &&
    !contract.cancelationRequested &&
    (view === "seller" || contract.tradeStatus !== "fundingExpired") &&
    !(
      view === "seller" &&
      (contract.paymentExpectedBy?.getTime() || 0) < Date.now()
    )
  );
};
