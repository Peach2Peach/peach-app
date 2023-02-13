import { isTradeCanceled, isTradeComplete } from '../../../utils/contract/status'
import { isDisputeActive } from '../../../utils/contract/status/isDisputeActive'

const THIRTYDAYSINMS = 2592000000

export const isChatActive = (contract: Contract | null): boolean =>
  !!contract
  && (isDisputeActive(contract)
    || (!isTradeCanceled(contract) && !isTradeComplete(contract))
    || (isTradeComplete(contract)
      && !!contract.paymentConfirmed
      && Date.now() - contract.paymentConfirmed.getTime() < THIRTYDAYSINMS))
