import { Bubble } from '../../../../components/bubble'
import { useNavigateToOfferOrContract } from '../../../../hooks/useNavigateToOfferOrContract'
import { contractIdToHex } from '../../../../utils/contract/contractIdToHex'

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
