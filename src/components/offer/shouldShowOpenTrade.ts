import { isTradeCanceled, isTradeComplete } from '../../utils/contract/status'

export const shouldShowOpenTrade = (contract: Contract) => !isTradeComplete(contract) && !isTradeCanceled(contract)
