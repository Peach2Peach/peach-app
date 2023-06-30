import { Text } from '../../../../components'
import { useFeeEstimates } from '../../../../hooks/query/useFeeEstimates'
import { useTransactionDetails } from '../../../../hooks/query/useTransactionDetails'
import { getTransactionFeeRate } from '../../../../utils/bitcoin'
import { getETAInBlocks } from '../../../../utils/electrum'
import i18n from '../../../../utils/i18n'

type Props = {
  txId: string
}
export const TransactionETA = ({ txId }: Props) => {
  const { transaction } = useTransactionDetails({ txId })
  const currentFeeRate = transaction ? getTransactionFeeRate(transaction) : 1
  const { feeEstimates } = useFeeEstimates()
  const etaInBlocks = getETAInBlocks(currentFeeRate, feeEstimates)

  return <Text>{i18n(`transaction.eta.${etaInBlocks === 1 ? 'in1Block' : 'inXBlocks'}`, String(etaInBlocks))}</Text>
}
