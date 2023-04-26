import { ContractItem } from '../components/ContractItem'
import { OfferItem } from '../components/OfferItem'
import { isContractSummary } from '../utils'

type TradeItemProps = {
  item: TradeSummary
}
export const TradeItem = ({ item }: TradeItemProps) =>
  isContractSummary(item) ? (
    <ContractItem key={item.id} contract={item} />
  ) : (
    <OfferItem key={item.id} offerSummary={item} />
  )
