import { isTradeCanceled, isTradeComplete } from '../../utils/contract/status'

export const shouldShowOpenTrade = (contract: Pick<Contract, 'paymentConfirmed' | 'canceled'>) =>
  !isTradeComplete(contract) && !isTradeCanceled(contract)
