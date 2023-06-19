import { StatusCard } from '../../../../components'
import { useNavigateToContract, useNavigateToOffer } from '../../hooks'
import { getStatusCardProps } from './helpers'

type Props = {
  item: TradeSummary
}

export const TradeItem = ({ item }: Props) => {
  const navigateToContract = useNavigateToContract(item)
  const navigateToOffer = useNavigateToOffer(item)

  const statusCardProps = getStatusCardProps(item, navigateToOffer, navigateToContract)

  return <StatusCard {...statusCardProps} />
}
