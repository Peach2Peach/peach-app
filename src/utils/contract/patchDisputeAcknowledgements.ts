export const patchDisputeAcknowledgements = (oldContract: Contract, newContract: Contract) => ({
  ...newContract,
  disputeResultAcknowledged: newContract.disputeActive
    ? false
    : newContract.disputeResultAcknowledged || oldContract.disputeResultAcknowledged,
  disputeAcknowledgedByCounterParty: newContract.disputeActive
    ? false
    : newContract.disputeAcknowledgedByCounterParty || oldContract.disputeAcknowledgedByCounterParty,
})
