import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View } from 'react-native'
import { Divider } from '../../../../components'
import { Bubble } from '../../../../components/bubble'
import { CopyableSummaryItem } from '../../../../components/summaryItem'
import { AddressSummaryItem } from '../../../../components/summaryItem/AddressSummaryItem'
import { AmountSummaryItem } from '../../../../components/summaryItem/AmountSummaryItem'
import { ConfirmationSummaryItem } from '../../../../components/summaryItem/ConfirmationSummaryItem'
import { TabBar } from '../../../../components/ui/TabBar'
import { useTransactionDetails } from '../../../../hooks/query/useTransactionDetails'
import tw from '../../../../styles/tailwind'
import { contractIdToHex } from '../../../../utils/contract'
import { toShortDateFormat } from '../../../../utils/date'
import i18n from '../../../../utils/i18n'
import { offerIdToHex } from '../../../../utils/offer'
import { priceFormat } from '../../../../utils/string'
import { useTransactionDetailsInfoSetup } from '../../hooks/useTransactionDetailsInfoSetup'
import { TransactionETASummaryItem } from './TransactionETASummaryItem'

type Props = {
  transaction: TransactionSummary
  transactionDetails?: Transaction | null
}

type OfferDataProps = {
  price?: number
  amount: number
  currency?: Currency
  address?: string
  type: TransactionType
  transaction: TransactionSummary
}
const OfferData = ({ price, currency, amount: offerAmount, address, type, transaction }: OfferDataProps) => {
  const { transaction: transactionDetails } = useTransactionDetails({ txId: transaction.id })
  const amount = transactionDetails?.vout.find((vout) => vout.scriptpubkey_address === address)?.value || offerAmount
  return (
    <View style={tw`flex-grow gap-4`}>
      {!!amount && <AmountSummaryItem amount={amount} />}

      {price && currency && type !== 'REFUND' && (
        <CopyableSummaryItem title={i18n('price')} text={`${priceFormat(price)} ${currency}`} />
      )}
      <AddressSummaryItem title={i18n('to')} address={address} />
    </View>
  )
}
const Tab = createMaterialTopTabNavigator()

export const TransactionDetailsInfo = ({ transaction }: Props) => {
  const { id, type, offerData, amount, confirmed, height, date } = transaction
  const { receivingAddress, canBumpFees, goToBumpNetworkFees, openInExplorer } = useTransactionDetailsInfoSetup({
    transaction,
  })

  return (
    <View style={tw`gap-4`}>
      <Divider />

      {offerData.length > 1 && (
        <Tab.Navigator
          style={tw`flex-shrink h-30`}
          sceneContainerStyle={tw`mt-4`}
          initialRouteName={getOfferDataId(offerData[0])}
          tabBar={TabBar}
        >
          {offerData.map((offer) => (
            <Tab.Screen
              key={`tab-screen-${getOfferDataId(offer)}`}
              name={getOfferDataId(offer)}
              children={() => <OfferData {...offer} {...{ type, transaction }} />}
            />
          ))}
        </Tab.Navigator>
      )}
      {offerData.length === 1
        && offerData.map((offer) => (
          <OfferData key={`tab-screen-${getOfferDataId(offer)}`} {...offer} {...{ type, transaction }} />
        ))}
      {offerData.length === 0 && <OfferData {...{ address: receivingAddress, type, transaction }} />}

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
function getOfferDataId (offer: OfferData) {
  if (offer.contractId) return contractIdToHex(offer.contractId)
  if (offer.offerId) return offerIdToHex(offer.offerId)
  return 'unknown'
}
