import { useSetPopup } from '../../../../components/popup/Popup'
import { TextSummaryItem } from '../../../../components/summaryItem'
import { HelpPopup } from '../../../../hooks/HelpPopup'
import { useFeeEstimates } from '../../../../hooks/query/useFeeEstimates'
import { useTransactionDetails } from '../../../../hooks/query/useTransactionDetails'
import tw from '../../../../styles/tailwind'
import { getTransactionFeeRate } from '../../../../utils/bitcoin/getTransactionFeeRate'
import { getETAInBlocks } from '../../../../utils/electrum/getETAInBlocks'
import i18n from '../../../../utils/i18n'

type Props = {
  txId: string
}
export const TransactionETASummaryItem = ({ txId }: Props) => {
  const setPopup = useSetPopup()
  const showHelp = () => setPopup(<HelpPopup id="confirmationTime" />)
  const { transaction } = useTransactionDetails({ txId })
  const currentFeeRate = transaction ? getTransactionFeeRate(transaction) : 1
  const { feeEstimates } = useFeeEstimates()
  const etaInBlocks = getETAInBlocks(currentFeeRate, feeEstimates)

  return (
    <TextSummaryItem
      title={i18n('time')}
      text={i18n(`transaction.eta.${etaInBlocks === 1 ? 'in1Block' : 'inXBlocks'}`, String(etaInBlocks))}
      iconId="helpCircle"
      iconColor={tw.color('info-main')}
      onPress={showHelp}
    />
  )
}
