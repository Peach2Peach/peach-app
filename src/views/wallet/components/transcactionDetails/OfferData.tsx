import { View } from 'react-native'
import { CopyableSummaryItem } from '../../../../components/summaryItem'
import { AddressSummaryItem } from '../../../../components/summaryItem/AddressSummaryItem'
import { AmountSummaryItem } from '../../../../components/summaryItem/AmountSummaryItem'
import { useTransactionDetails } from '../../../../hooks/query/useTransactionDetails'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { priceFormat } from '../../../../utils/string/priceFormat'

type OfferDataProps = ComponentProps & {
  price?: number
  amount: number
  currency?: Currency
  address?: string
  type: TransactionType
  transaction: TransactionSummary
}
export const OfferData = ({
  price,
  currency,
  amount: offerAmount,
  address,
  type,
  transaction,
  ...componentProps
}: OfferDataProps) => {
  const { transaction: transactionDetails } = useTransactionDetails({ txId: transaction.id })
  const amount = transactionDetails?.vout.find((vout) => vout.scriptpubkey_address === address)?.value || offerAmount
  return (
    <View style={tw`gap-4`} {...componentProps}>
      <AmountSummaryItem amount={amount} />

      {price && currency && type !== 'REFUND' && (
        <CopyableSummaryItem title={i18n('price')} text={`${priceFormat(price)} ${currency}`} />
      )}
      <AddressSummaryItem title={i18n('to')} address={address} />
    </View>
  )
}
