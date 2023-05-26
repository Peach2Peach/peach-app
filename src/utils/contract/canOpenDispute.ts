import { isCashTrade } from '../paymentMethod/isCashTrade'

export const canOpenDispute = (contract: Contract, view?: ContractViewer) =>
  !!contract.symmetricKey
  && ((!contract.disputeActive && !isCashTrade(contract.paymentMethod))
    || (view === 'seller' && contract.cancelationRequested))
