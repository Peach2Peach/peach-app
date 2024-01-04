import { StatusCard } from '../../../components/statusCard/StatusCard'
import { useNavigation } from '../../../hooks/useNavigation'
import { getShortDateFormat } from '../../../utils/date/getShortDateFormat'
import { getTxSummaryTitle } from '../helpers/getTxSummaryTitle'
import { TransactionIcon } from './TransactionIcon'
import { levelMap } from './levelMap'

type Props = {
  item: Pick<TransactionSummary, 'amount' | 'type' | 'date' | 'id'>
}

export const TxStatusCard = ({ item: { type, amount, date, id } }: Props) => {
  const navigation = useNavigation()

  return (
    <StatusCard
      title={getTxSummaryTitle(type)}
      icon={<TransactionIcon type={type} size={17} />}
      amount={amount}
      subtext={getShortDateFormat(date)}
      onPress={() => {
        navigation.navigate('transactionDetails', { txId: id })
      }}
      color={levelMap[type]}
    />
  )
}
