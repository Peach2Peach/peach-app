import { getBuyerStatusText } from './getBuyerStatusText'
import { getSellerStatusText } from './getSellerStatusText'

export const getTradeActionStatusText = (contract: Contract, view: ContractViewer) => {
  if (view === 'buyer') {
    return getBuyerStatusText(contract)
  }
  return getSellerStatusText(contract)
}
