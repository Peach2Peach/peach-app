export const shouldShowYouGotADispute = (contract: Contract, account: Account) =>
  contract.disputeActive
  && contract.disputeInitiator !== account.publicKey
  && !contract.disputeAcknowledgedByCounterParty
