import { StatusCard } from '../../../components/statusCard'
import { useNavigation } from '../../../hooks'
import { getShortDateFormat } from '../../../utils/date'
import { getTxSummaryTitle } from '../helpers/getTxSummaryTitle'
import { TransactionIcon } from './TransactionIcon'
import { levelMap } from './levelMap'

type Props = {
  tx: TransactionSummary
}

export const TxStatusCard = ({ tx }: Props) => {
  const navigation = useNavigation()

  return (
    <StatusCard
      title={getTxSummaryTitle(tx.type)}
      icon={<TransactionIcon type={tx.type} size={17} />}
      amount={tx.amount}
      subtext={getShortDateFormat(tx.date)}
      onPress={() => {
        navigation.navigate('transactionDetails', { txId: tx.id })
      }}
      color={levelMap[tx.type]}
    />
  )
}
