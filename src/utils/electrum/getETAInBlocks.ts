import { keys } from "../object/keys";

export const getETAInBlocks = (
  feeRate: number,
  feeEstimates: ConfirmationTargets,
) =>
  Number(
    keys(feeEstimates).find((eta) => feeRate > feeEstimates[eta]) || "1008",
  );
