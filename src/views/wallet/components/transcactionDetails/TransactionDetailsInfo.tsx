import { View } from 'react-native'
import { Divider } from '../../../../components'
import { Bubble } from '../../../../components/bubble'
import { CopyableSummaryItem } from '../../../../components/summaryItem'
import { ConfirmationSummaryItem } from '../../../../components/summaryItem/ConfirmationSummaryItem'
import tw from '../../../../styles/tailwind'
import { contractIdToHex } from '../../../../utils/contract'
import { toShortDateFormat } from '../../../../utils/date'
import i18n from '../../../../utils/i18n'
import { offerIdToHex } from '../../../../utils/offer'
import { useTransactionDetailsInfoSetup } from '../../hooks/useTransactionDetailsInfoSetup'
import { AddressLabelInput } from '../AddressLabelInput'
import { OutputInfo } from './OutputInfo'
import { TransactionETASummaryItem } from './TransactionETASummaryItem'

type Props = {
  transaction: TransactionSummary
}

export const TransactionDetailsInfo = ({ transaction }: Props) => {
  const { id, confirmed, height, date } = transaction
  const { receivingAddress, canBumpFees, goToBumpNetworkFees, openInExplorer } = useTransactionDetailsInfoSetup({
    transaction,
  })

  return (
    <View style={tw`gap-4`}>
      {transaction.type === 'DEPOSIT' && !!receivingAddress && (
        <AddressLabelInput address={receivingAddress} fallback={i18n('unlabeled')} />
      )}
      <Divider />

      <OutputInfo {...{ transaction, receivingAddress }} />

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

export function getOfferDataId (offer: OfferData) {
  if (offer.contractId) return contractIdToHex(offer.contractId)
  if (offer.offerId) return offerIdToHex(offer.offerId)
  return 'unknown'
}
