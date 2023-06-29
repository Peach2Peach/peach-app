export const getETAInBlocks = (feeRate: number, feeEstimates: ConfirmationTargets) =>
  Number((Object.keys(feeEstimates) as TargetBlocks[]).find((eta) => feeRate > feeEstimates[eta]) || '1008')
