import { useMemo } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Text } from '../../../../components'
import { useIsMediumScreen } from '../../../../hooks'
import { useTradeSummaryStore } from '../../../../store/tradeSummaryStore'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { isDefined } from '../../../../utils/validation'
import { TransactionIcon } from '../TransactionIcon'
import { OfferIdBubble } from './OfferIdBubble'
import { TradeIdBubble } from './TradeIdBubble'

type Props = ComponentProps & Pick<TransactionSummary, 'type' | 'offerData'>

export const TransactionHeader = ({ type, offerData, style }: Props) => {
  const isMediumScreen = useIsMediumScreen()
  const [getOffer, getContract] = useTradeSummaryStore((state) => [state.getOffer, state.getContract], shallow)
  const offerSummaries = useMemo(
    () =>
      offerData
        .map((offer) => (!offer.contractId && offer.offerId ? getOffer(offer.offerId) : undefined))
        .filter(isDefined),
    [getOffer, offerData],
  )
  const contractSummaries = useMemo(
    () => offerData.map((offer) => (offer.contractId ? getContract(offer.contractId) : undefined)).filter(isDefined),
    [getContract, offerData],
  )
  const hasIdBubbles = offerSummaries.length + contractSummaries.length > 0

  return (
    <View style={[tw`flex-row items-center gap-4`, hasIdBubbles && tw`items-end`, style]}>
      <TransactionIcon type={type} size={isMediumScreen ? 56 : 48} />
      <View style={tw`items-start flex-shrink`}>
        <Text style={[tw`h6`, tw.md`h5`]}>{i18n(`wallet.transactionDetails.type.${type}`)}</Text>
        <View style={tw`flex-row flex-wrap gap-1`}>
          {offerSummaries.map((offer) => (
            <OfferIdBubble key={`offer-id-bubble-${offer.id}`} offer={offer} />
          ))}
          {contractSummaries.map((trade) => (
            <TradeIdBubble key={`trade-id-bubble-${trade.id}`} trade={trade} />
          ))}
        </View>
      </View>
    </View>
  )
}
