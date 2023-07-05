import { View } from 'react-native'
import { Divider } from '../../../../components'
import { Bubble } from '../../../../components/bubble'
import { CopyableSummaryItem } from '../../../../components/summaryItem'
import { AddressSummaryItem } from '../../../../components/summaryItem/AddressSummaryItem'
import { AmountSummaryItem } from '../../../../components/summaryItem/AmountSummaryItem'
import { ConfirmationSummaryItem } from '../../../../components/summaryItem/ConfirmationSummaryItem'
import tw from '../../../../styles/tailwind'
import { toShortDateFormat } from '../../../../utils/date'
import i18n from '../../../../utils/i18n'
import { priceFormat } from '../../../../utils/string'
import { useTransactionDetailsInfoSetup } from '../../hooks/useTransactionDetailsInfoSetup'
import { TransactionETASummaryItem } from './TransactionETASummaryItem'

type Props = {
  transaction: TransactionSummary
  transactionDetails?: Transaction | null
}
export const TransactionDetailsInfo = ({ transaction }: Props) => {
  const { id, type, amount, price, currency, confirmed, height, date } = transaction
  const { receivingAddress, canBumpFees, goToBumpNetworkFees, openInExplorer } = useTransactionDetailsInfoSetup({
    transaction,
  })
  return (
    <View style={tw`gap-4`}>
      <Divider />

      <AmountSummaryItem amount={amount} />
      {price && type !== 'REFUND' && (
        <CopyableSummaryItem title={i18n('price')} text={`${priceFormat(price)} ${currency}`} />
      )}
      <AddressSummaryItem title={i18n('to')} address={receivingAddress} />

      <Divider />

      <ConfirmationSummaryItem confirmed={confirmed} />
      {confirmed ? (
        <>
          <CopyableSummaryItem title={i18n('block')} text={String(height)} />
          <CopyableSummaryItem title={i18n('time')} text={toShortDateFormat(date)} />
        </>
      ) : (
        <TransactionETASummaryItem txId={id} />
      )}

      {canBumpFees && (
        <Bubble color="primary" onPress={goToBumpNetworkFees} iconId="chevronsUp" iconSize={16} style={tw`self-center`}>
          {i18n('wallet.bumpNetworkFees.button')}
        </Bubble>
      )}

      <Divider />

      <Bubble color="primary" style={tw`self-center`} ghost iconId="externalLink" iconSize={16} onPress={openInExplorer}>
        {i18n('transaction.viewInExplorer')}
      </Bubble>
    </View>
  )
}
