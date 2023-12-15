import { StatusCard } from '../../../../components/statusCard/StatusCard'
import { useNavigateToOfferOrContract } from '../../../../hooks'
import { getStatusCardProps } from './helpers'

type Props = {
  item: TradeSummary
}

export const TradeItem = ({ item }: Props) => {
  const onPress = useNavigateToOfferOrContract(item)
  const statusCardProps = getStatusCardProps(item)

  return <StatusCard {...{ ...item, ...statusCardProps, onPress }} />
}
