import { Bubble } from '../../../../components/bubble'
import { useNavigateToOfferOrContract } from '../../../../hooks'
import { contractIdToHex } from '../../../../utils/contract'

type Props = {
  trade: ContractSummary
}

export const TradeIdBubble = ({ trade }: Props) => {
  const goToContract = useNavigateToOfferOrContract(trade)
  const tradeId = contractIdToHex(trade.id)

  return (
    <Bubble color="primary-mild" iconId="info" onPress={goToContract}>
      {tradeId}
    </Bubble>
  )
}