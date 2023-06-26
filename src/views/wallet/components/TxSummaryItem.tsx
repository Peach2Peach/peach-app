import { StatusCard } from '../../../components/statusCard'
import { useNavigation } from '../../../hooks'
import { getShortDateFormat } from '../../../utils/date'
import { getTxSummaryTitle } from '../helpers/getTxSummaryTitle'
import { iconMap } from './iconMap'
import { levelMap } from './levelMap'

type Props = {
  tx: TransactionSummary
}

export const TxSummaryItem = ({ tx }: Props) => {
  const navigation = useNavigation()

  return (
    <StatusCard
      title={getTxSummaryTitle(tx)}
      icon={iconMap[tx.type]}
      {...tx}
      subtext={getShortDateFormat(tx.date)}
      onPress={() => {
        navigation.navigate('transactionDetails', { txId: tx.id })
      }}
      color={levelMap[tx.type]}
    />
  )
}
