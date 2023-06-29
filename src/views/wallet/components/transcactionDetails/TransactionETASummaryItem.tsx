import { Text } from '../../../../components'
import { TextSummaryItem } from '../../../../components/summaryItem'
import { useShowHelp } from '../../../../hooks'
import { useFeeEstimates } from '../../../../hooks/query/useFeeEstimates'
import { useTransactionDetails } from '../../../../hooks/query/useTransactionDetails'
import tw from '../../../../styles/tailwind'
import { getTransactionFeeRate } from '../../../../utils/bitcoin'
import { getETAInBlocks } from '../../../../utils/electrum'
import i18n from '../../../../utils/i18n'

type Props = {
  txId: string
}
export const TransactionETASummaryItem = ({ txId }: Props) => {
  const showHelp = useShowHelp('confirmationTime')
  const { transaction } = useTransactionDetails({ txId })
  const currentFeeRate = transaction ? getTransactionFeeRate(transaction) : 1
  const { feeEstimates } = useFeeEstimates()
  const etaInBlocks = getETAInBlocks(currentFeeRate, feeEstimates)

  return (
    <TextSummaryItem
      title={i18n('time')}
      text={i18n(`transaction.eta.${etaInBlocks === 1 ? 'in1Block' : 'inXBlocks'}`, String(etaInBlocks))}
      iconId="helpCircle"
      iconColor={tw`text-info-main`.color}
      onPress={showHelp}
    />
  )
}
