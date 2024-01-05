import { ContractSummary } from '../../../../../peach-api/src/@types/contract'
import { OfferSummary } from '../../../../../peach-api/src/@types/offer'
import { StatusCard } from '../../../../components/statusCard/StatusCard'
import { useNavigateToOfferOrContract } from '../../../../hooks/useNavigateToOfferOrContract'
import { getStatusCardProps } from './getStatusCardProps'

type Props = {
  item: OfferSummary | ContractSummary
}

export const TradeItem = ({ item }: Props) => {
  const onPress = useNavigateToOfferOrContract(item)
  const statusCardProps = getStatusCardProps(item)

  return <StatusCard {...{ ...item, ...statusCardProps, onPress }} />
}
