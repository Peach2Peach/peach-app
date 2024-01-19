import { address as Address, Transaction } from 'bitcoinjs-lib'
import { View } from 'react-native'
import { CopyableSummaryItem } from '../../../../components/summaryItem'
import { AddressSummaryItem } from '../../../../components/summaryItem/AddressSummaryItem'
import { AmountSummaryItem } from '../../../../components/summaryItem/AmountSummaryItem'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { priceFormat } from '../../../../utils/string/priceFormat'
import { getNetwork } from '../../../../utils/wallet/getNetwork'

type OfferDataProps = ComponentProps & {
  price?: number
  amount: number
  currency?: Currency
  address?: string
  type: TransactionType
  transactionDetails: Transaction
}
export const OfferData = ({
  price,
  currency,
  amount: offerAmount,
  address,
  type,
  transactionDetails,
  ...componentProps
}: OfferDataProps) => {
  const amount
    = transactionDetails?.outs.find((v) => Address.fromOutputScript(v.script, getNetwork()) === address)?.value
    || offerAmount
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
